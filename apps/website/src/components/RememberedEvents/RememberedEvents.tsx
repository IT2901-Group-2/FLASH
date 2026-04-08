"use client";

import { Event } from "@/db";
import { useEventsQuery } from "@/hooks/useEvents";
import { useJoinedEvents } from "@/providers/JoinedEventsContext";
import { Card, Title } from "@flash/ui";
import { Calendar, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import styles from "./RememberedEvents.module.css";

const RememberedEvent = ({ name, uploadLimit }: Event) => {
  const c = useTranslations("common");
  const navigation = useRouter();
  return (
    <Card onClick={() => navigation.back()} className={styles.linkcard}>
      <div className={styles.content}>
        <Title size="small">{name}</Title>
        <span>
          {uploadLimit ?? c("values.unlimited")} {c("values.photos")}
        </span>
      </div>
      <ChevronRight />
    </Card>
  );
};

const RememberedEvents = () => {
  const t = useTranslations("guest.event");
  const eventIDs = useJoinedEvents();
  const {
    data: eventsData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useEventsQuery(
    {
      id: eventIDs,
    },
    eventIDs.length !== 0
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
    if (eventIDs.length === 0) return;
    if (!eventsData) return;
    if (isFetchingNextPage) return;
    if (hasLoadedAllJoinedEvents) return;
    if (!hasNextPage) return;

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
