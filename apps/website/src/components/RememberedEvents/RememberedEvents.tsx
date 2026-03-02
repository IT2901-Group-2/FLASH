import { useEventsQuery } from "@/hooks/useEvents";
import { EventDTO } from "@/types/eventTypes";
import { Calendar, ChevronRight } from "lucide-react";
import { Card, Title } from "ui";
import styles from "./RememberedEvents.module.css";
import { useRouter } from "next/navigation";

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
  const events = useEventsQuery().data;
  if (!events) return;

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
