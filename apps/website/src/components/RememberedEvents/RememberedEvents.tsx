"use client";

import { useEventsQuery } from "@/hooks/useEvents";
import { EventDTO } from "@/types/eventTypes";
import { Calendar, ChevronRight } from "lucide-react";
import { Card, Title } from "ui";
import styles from "./RememberedEvents.module.css";
import { useRouter } from "next/navigation";
import { getAllJoinedEvents } from "@/hooks/useRememberEvents";

const RememberedEvent = ({ name, uploadLimit, id }: EventDTO) => {
  const navigation = useRouter();
  return (
    <Card onClick={() => navigation.push(`/${id}`)} className={styles.linkcard}>
      <div>
        <Title size="small">{name}</Title>
        <span>{uploadLimit ?? "Unlimited"} Photos</span>
      </div>
      <ChevronRight />
    </Card>
  );
};

const RememberedEvents = () => {
  console.log(typeof window);
  const allEventIDs = getAllJoinedEvents();

  const events = useEventsQuery({
    id: allEventIDs.length !== 0 ? allEventIDs : ["A"],
  }).data;
  if (!events) return;

  if (events.length === 0) return;

  return (
    <Card className={styles.card}>
      <div>
        <Calendar />
        <Title size="medium">Your Events</Title>
      </div>
      {events.map(event => (
        <RememberedEvent {...event} key={event.id} />
      ))}
    </Card>
  );
};

export default RememberedEvents;
