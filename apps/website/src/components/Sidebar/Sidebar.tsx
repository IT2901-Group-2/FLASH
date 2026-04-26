"use client";

import { ArrowLeft, Calendar, House, Languages, Moon, Sun } from "lucide-react";
import { Sidebar as FlashSidebar, useSidebar } from "@flash/ui";
import { useTranslations } from "next-intl";
import { HTMLAttributes, useEffect, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useRouter } from "next/navigation";
import Logo from "../Logo/Logo";
import { useEventsQuery, useJoinedEvents } from "@/hooks/useEvents";
import LanguageSwitch from "./LanguageSwitch";
import { useLanguage } from "@/hooks/useLanguage";
import useIsMobile from "@/hooks/useIsMobile";
import ModTag from "./ModTag";
import { EventCookie } from "@/db";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const t = useTranslations("common.navigation");

  const { setOpen } = useSidebar();

  const { data: auth } = useAuth();
  const mounted = useIsMounted();
  const isMobile = useIsMobile();
  const navigation = useRouter();
  const { switchLocale } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();

  const { data: rememberedEvents = [] } = useJoinedEvents();
  const eventIDs = useMemo(
    () => rememberedEvents.map(event => event.eventId),
    [rememberedEvents]
  );
  const {
    data: eventData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useEventsQuery(
    {
      id: eventIDs,
    },
    eventIDs.length > 0
  );
  const events = useMemo(
    () => eventData?.pages?.flatMap(page => page.items) ?? [],
    [eventData]
  );
  const loadedEventIds = useMemo(() => new Set(events.map(event => event.id)), [events]);
  const hasLoadedAllJoinedEvents = useMemo(
    () => eventIDs.every(id => loadedEventIds.has(id)),
    [eventIDs, loadedEventIds]
  );

  useEffect(() => {
    if (
      eventIDs.length === 0 ||
      !eventData ||
      isFetchingNextPage ||
      hasLoadedAllJoinedEvents ||
      !hasNextPage
    ) {
      return;
    }

    void fetchNextPage();
  }, [
    eventIDs.length,
    eventData,
    hasNextPage,
    isFetchingNextPage,
    hasLoadedAllJoinedEvents,
    fetchNextPage,
  ]);

  const handleRedirect = (href: string) => {
    if (isMobile) setOpen(false);
    navigation.push(href);
  };

  const rememberedEventsMap = rememberedEvents.reduce(
    (acc, re) => ({ ...acc, [re.eventId]: re }),
    {} as Record<string, Omit<EventCookie, "userId">>
  );

  return (
    <FlashSidebar className={className} {...rest}>
      <FlashSidebar.Header logo={<Logo />}>FLASH</FlashSidebar.Header>
      {auth?.isAdmin && (
        <FlashSidebar.Group title={t("admin")}>
          <FlashSidebar.Item
            icon={<House />}
            border
            onClick={() => handleRedirect("/admin/dashboard")}
          >
            {t("dashboard")}
          </FlashSidebar.Item>
        </FlashSidebar.Group>
      )}
      {events && events.length > 0 && (
        <FlashSidebar.Group
          title={t("events")}
          hideChildrenWhenClosed
          icon={<Calendar />}
          scroll
        >
          {events?.map(event => (
            <FlashSidebar.Item
              key={event.id}
              border
              onClick={() => handleRedirect(`/events/${event.id}`)}
            >
              {event.name}
              <ModTag isMod={rememberedEventsMap[event.id]?.isModerator ?? false} />
            </FlashSidebar.Item>
          ))}
        </FlashSidebar.Group>
      )}
      <FlashSidebar.Group title={t("options")} position="bottom">
        <FlashSidebar.Item icon={<Languages />} onClick={switchLocale}>
          {t("language")} <LanguageSwitch />
        </FlashSidebar.Item>
        {mounted && (
          <FlashSidebar.Item
            icon={resolvedTheme === "dark" ? <Sun /> : <Moon />}
            onClick={toggleTheme}
          >
            {resolvedTheme === "dark" ? t("darkMode") : t("lightMode")}
          </FlashSidebar.Item>
        )}
      </FlashSidebar.Group>
      <FlashSidebar.Group>
        <FlashSidebar.Item
          icon={<ArrowLeft />}
          data-color="brand-purple"
          onClick={() => navigation.push("/")}
        >
          {t("back")}
        </FlashSidebar.Item>
      </FlashSidebar.Group>
    </FlashSidebar>
  );
};

export default Sidebar;
