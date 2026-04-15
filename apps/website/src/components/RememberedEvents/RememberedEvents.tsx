"use client";

import { Event } from "@/db";
import { useEventsQuery, useJoinedEvents } from "@/hooks/useEvents";
import { Card, Title } from "@flash/ui";
import { Calendar, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import styles from "./RememberedEvents.module.css";

const RememberedEvent = ({ name, uploadLimit, id }: Event) => {
  const c = useTranslations("common");
  const navigation = useRouter();
  return (
    <Card onClick={() => navigation.push(`/events/${id}`)} className={styles.linkcard}>
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
  const { data: joinedEvents = [] } = useJoinedEvents();
  const eventIDs = joinedEvents.map(e => e.eventId);
  const events = useEventsQuery(
    {
      id: eventIDs,
    },
    eventIDs.length !== 0
  ).data;
  if (!events) return;

  if (events.length === 0) return;

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
