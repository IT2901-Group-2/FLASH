import { Calendar, EditIcon, Image as ImageIcon, Trash, Users } from "lucide-react";
import { Card, Title, Dialog, Button } from "@flash/ui";
import styles from "./EventCard.module.css";
import { cl } from "@/utils/className";
import { Event } from "@/db";
import { useDeleteEventMutation } from "@/hooks/useEvents";
import { useImagesQuery } from "@/hooks/useImages";
import { MouseEvent, useMemo, useRef } from "react";
import EditEventCard from "../EventDialogs/EditEventDialog";
import { useTranslations } from "next-intl";

export interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Event name.
   */
  data: Event;
}

const EventCard = ({ data, ...rest }: EventCardProps) => {
  const t = useTranslations("admin.dashboard.event.details");
  const c = useTranslations("common.actions");
  const { mutate } = useDeleteEventMutation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement>(null);
  const { name, startDate, uploadLimit, id } = data;
  const { data: images = [] } = useImagesQuery(id);

  const { totalPhotos, approvedPhotos, pendingPhotos } = useMemo(() => {
    const total = images.length;
    const approved = images.filter(image => image.isApproved === true).length;
    const pending = images.filter(image => image.isApproved === null).length;

    return {
      totalPhotos: total,
      approvedPhotos: approved,
      pendingPhotos: pending,
    };
  }, [images]);

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteConfirmRef.current?.showModal();
  };

  const confirmDelete = () => {
    deleteConfirmRef.current?.close();
    mutate({ eventId: id });
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dialogRef.current?.showModal();
  };

  return (
    <>
      <Dialog ref={deleteConfirmRef}>
        <Title>{t("deleteConfirmation.title")}</Title>
        <p>{t("deleteConfirmation.message")}</p>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button
            variant="secondary"
            data-color="neutral"
            onClick={() => deleteConfirmRef.current?.close()}
          >
            {c("cancel")}
          </Button>
          <Button
            data-color="danger"
            onClick={confirmDelete}
          >
            {c("delete")}
          </Button>
        </div>
      </Dialog>
      <EditEventCard
        ref={dialogRef}
        event={data}
        onClose={() => dialogRef.current?.close()}
      />
      <Card {...rest} className={styles.card}>
        <div className={styles.column}>
          <Title className={styles.title} size="xsmall">
            {name}
          </Title>
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
            {t("summary.totalPhotos")}
            <span className={styles.row} data-testid="event-total-photos">
              <ImageIcon size={16} /> {totalPhotos}
            </span>
          </div>
          <div className={cl(styles.column, styles.soft)}>
            {t("summary.approved")}{" "}
            <span data-testid="event-approved-photos">{approvedPhotos}</span>
          </div>
          <div className={cl(styles.column, styles.soft)}>
            {t("summary.pending")}{" "}
            <span data-testid="event-pending-photos">{pendingPhotos}</span>
          </div>
        </div>
        <div className={cl(styles.row, styles.footer)}>
          <div className={styles.row}>
            <Users size={16} />
            <span>
              {uploadLimit
                ? t("uploadLimit.perPerson", { count: uploadLimit })
                : t("uploadLimit.none")}
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
