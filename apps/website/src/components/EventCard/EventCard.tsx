import { EventDto } from "@/types/eventTypes";
import { Calendar, Users } from "lucide-react";
import { Card } from "ui";

const EventCard = ({ name, startDate, uploadLimit }: EventDto) => {
  return (
    <Card data-color="neutral">
      <h3>{name}</h3>
      <Calendar />
      <span>{startDate}</span>
      <hr />
      <Users />
      <span>{uploadLimit} photos/person</span>
    </Card>
  );
};

export default EventCard;
