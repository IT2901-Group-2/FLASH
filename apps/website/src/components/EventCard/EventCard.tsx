import { EventDTO } from "@/types/eventTypes";
import { Calendar, Image as ImageIcon, Users } from "lucide-react";
import { Card } from "ui";
import styles from "./EventCard.module.css";
import { cl } from "@/utils/className";

export interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Event name.
   */
  data: EventDTO;
}

const EventCard = ({ data, ...rest }: EventCardProps) => {
  const { name, startDate, uploadLimit } = data;
  return (
    <Card {...rest} className={styles.card}>
      <div className={styles.column}>
        <h3 className={styles.title}>{name}</h3>
        <div className={styles.row}>
          <Calendar size={16} />
          <span>
            {new Date(startDate).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>
      <div className={styles.info}>
        <div className={cl(styles.column, styles.soft)}>
          Total Photos
          <span className={styles.row}>
            <ImageIcon size={16} /> 0
          </span>
        </div>
        <div className={cl(styles.column, styles.soft)}>
          Approved <span>0</span>
        </div>
        <div className={cl(styles.column, styles.soft)}>
          Pending <span>0</span>
        </div>
      </div>
      <div className={cl(styles.row, styles.uploadLimit)}>
        <Users size={16} />
        <span>{uploadLimit} photos/person</span>
      </div>
    </Card>
  );
};

export default EventCard;
