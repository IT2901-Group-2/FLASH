"use client";

import { Event } from "@/db";
import { useEventsQuery, useJoinedEvents } from "@/hooks/useEvents";
import { useUploadedImageCountQuery } from "@/hooks/useImages";
import { Card, Title } from "@flash/ui";
import { Calendar, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import styles from "./RememberedEvents.module.css";

const RememberedEvent = ({ name, uploadLimit, id }: Event) => {
  const t = useTranslations("common.uploads");
  const navigation = useRouter();
  const { data: uploadedCountData } = useUploadedImageCountQuery(id);

  const userImageCount = uploadedCountData?.count ?? 0;

  const getDescription = (uploadLimit: number | null | undefined, used: number) => {
    if (typeof uploadLimit !== "number") return t("unlimited.short");
    const remaining = Math.max(0, uploadLimit - used);
    return remaining === 0 ? t("none.short") : t("remaining.short", { count: remaining });
  };

  const description = getDescription(uploadLimit, userImageCount);

  return (
    <Card onClick={() => navigation.push(`/events/${id}`)} className={styles.linkcard}>
      <div className={styles.content}>
        <Title size="small">{name}</Title>
        <span>{description}</span>
      </div>
      <ChevronRight />
    </Card>
  );
};

const RememberedEvents = () => {
  const t = useTranslations("guest.event");
  const { data: rememberedEvents = [] } = useJoinedEvents();
  const eventIDs = useMemo(
    () => rememberedEvents.map(e => e.eventId),
    [rememberedEvents]
  );
  const {
    data: eventsData,
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
    () => eventsData?.pages.flatMap(page => page.items) ?? [],
    [eventsData]
  );
  const loadedEventIds = useMemo(() => new Set(events.map(event => event.id)), [events]);
  const hasLoadedAllJoinedEvents = useMemo(
    () => eventIDs.every(id => loadedEventIds.has(id)),
    [eventIDs, loadedEventIds]
  );

  useEffect(() => {
    if (
      eventIDs.length === 0 ||
      !eventsData ||
      isFetchingNextPage ||
      hasLoadedAllJoinedEvents ||
      !hasNextPage
    )
      return;

    void fetchNextPage();
  }, [
    eventIDs.length,
    eventsData,
    hasNextPage,
    isFetchingNextPage,
    hasLoadedAllJoinedEvents,
    fetchNextPage,
  ]);

  if (events.length === 0) return null;

  return (
    <Card className={styles.card}>
      <div className={styles.title}>
        <Calendar />
        <Title size="medium">{t("list.title")}</Title>
      </div>
      {events.map(event => (
        <RememberedEvent {...event} key={event.id} />
      ))}
    </Card>
  );
};

export default RememberedEvents;
