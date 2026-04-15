"use client";

import { Event } from "@/db";
import { useEventsQuery, useJoinedEvents } from "@/hooks/useEvents";
import { useUploadedImageCountQuery } from "@/hooks/useImages";
import { Card, Title } from "@flash/ui";
import { Calendar, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
  const events = useEventsQuery(
    {
      id: rememberedEvents.map(e => e.eventId),
    },
    rememberedEvents.length > 0
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
