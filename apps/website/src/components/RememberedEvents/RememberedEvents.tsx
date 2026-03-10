"use client";

import { useEventsQuery } from "@/hooks/useEvents";
import { Event } from "@/db";
import { Calendar, ChevronRight } from "lucide-react";
import { Card, Title } from "ui";
import styles from "./RememberedEvents.module.css";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useJoinedEvents } from "@/providers/JoinedEventsContext";

const RememberedEvent = ({ name, uploadLimit, id }: Event) => {
  const t = useTranslations("guest.login");
  const navigation = useRouter();
  return (
    <Card onClick={() => navigation.push(`/events/${id}`)} className={styles.linkcard}>
      <div>
        <Title size="small">{name}</Title>
        <span>
          {uploadLimit ?? t("unlimited")} {t("photos")}
        </span>
      </div>
      <ChevronRight />
    </Card>
  );
};

const RememberedEvents = () => {
  const t = useTranslations("guest.login");
  const eventIDs = useJoinedEvents();
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
        <Title size="medium">{t("joinedEventsTitle")}</Title>
      </div>
      {events.map(event => (
        <RememberedEvent {...event} key={event.id} />
      ))}
    </Card>
  );
};

export default RememberedEvents;
