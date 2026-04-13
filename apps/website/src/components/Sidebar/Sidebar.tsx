"use client";

import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  House,
  Languages,
  Moon,
  Sun,
} from "lucide-react";
import { Sidebar as FlashSidebar } from "@flash/ui";
import { useTranslations } from "next-intl";
import { HTMLAttributes } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useRouter } from "next/navigation";
import Logo from "../Logo/Logo";
import { useJoinedEvents } from "@/providers/JoinedEventsContext";
import { useEventsQuery } from "@/hooks/useEvents";
import LanguageSwitch from "./LanguageSwitch";
import { useLanguage } from "@/hooks/useLanguage";

export const Sidebar = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const t = useTranslations("common.navigation");

  const mounted = useIsMounted();
  const navigation = useRouter();
  const { switchLocale } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();

  const eventIds = useJoinedEvents();
  const { data: events } = useEventsQuery({ id: eventIds.length > 0 ? eventIds : [""] });

  if (!events) return;

  return (
    <FlashSidebar className={className} {...rest}>
      <FlashSidebar.Header logo={<Logo />}>FLASH</FlashSidebar.Header>
      <FlashSidebar.Group title="Admin">
        <FlashSidebar.Item
          icon={<House />}
          border
          onClick={() => navigation.push("/admin/dashboard")}
        >
          Dashboard
        </FlashSidebar.Item>
      </FlashSidebar.Group>
      {events.length > 0 && (
        <FlashSidebar.Group
          title="Events"
          hideChildrenWhenClosed
          icon={<Calendar />}
          scroll
        >
          {events?.map(event => (
            <FlashSidebar.Item
              key={event.id}
              border
              onClick={() => navigation.push(`/events/${event.id}`)}
            >
              {event.name} <ChevronRight />
            </FlashSidebar.Item>
          ))}
        </FlashSidebar.Group>
      )}
      <FlashSidebar.Group title="Options" position="bottom">
        <FlashSidebar.Item icon={<Languages />} onClick={switchLocale}>
          Language <LanguageSwitch />
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
          Exit
        </FlashSidebar.Item>
      </FlashSidebar.Group>
    </FlashSidebar>
  );
};

export default Sidebar;
