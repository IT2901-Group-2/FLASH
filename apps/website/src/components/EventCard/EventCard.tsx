import { Calendar, EditIcon, Image as ImageIcon, Trash, Users } from "lucide-react";
import { Card } from "ui";
import styles from "./EventCard.module.css";
import { cl } from "@/utils/className";
import { Event } from "@/db";
import { useDeleteEventMutation } from "@/hooks/useEvents";
import { MouseEvent, useRef } from "react";
import EditEventCard from "../EventDialogs/EditEventDialog";

export interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Event name.
   */
  data: Event;
}

const EventCard = ({ data, ...rest }: EventCardProps) => {
  const { mutate } = useDeleteEventMutation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { name, startDate, uploadLimit, id } = data;

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    mutate({ eventId: id });
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dialogRef.current?.showModal();
  };

  return (
    <>
      <EditEventCard
        ref={dialogRef}
        event={data}
        onClose={() => dialogRef.current?.close()}
      />
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
        <div className={cl(styles.row, styles.footer)}>
          <div className={styles.row}>
            <Users size={16} />
            <span>
              {uploadLimit ? `${uploadLimit} photos per person` : "No photo limit"}
            </span>
          </div>
          <div className={styles.row}>
            <button className={styles.actionButton} onClick={handleEdit}>
              <EditIcon size={20} />
            </button>
            <button
              className={styles.actionButton}
              data-color="danger"
              onClick={handleDelete}
            >
              <Trash size={20} />
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default EventCard;
