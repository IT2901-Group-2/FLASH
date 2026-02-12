import { RefAttributes, useState } from "react";
import { Button, Card, Input, ProgressDots, Title } from "ui";
import styles from "./CreateEventCard.module.css";
import { Calendar } from "lucide-react";

interface CreateEventCardProps extends RefAttributes<HTMLDialogElement> {
  onClose?: () => void;
}

export const CreateEventCard = ({ ref, onClose, ...rest }: CreateEventCardProps) => {
  const [progress, setProgress] = useState<number>(1);

  return (
    <dialog ref={ref} className={styles.container} {...rest} autoFocus>
      <Card className={styles.card}>
        <ProgressDots maxValue={3} value={progress} data-color="brand-purple" />
        <Title description="Set up a new photo event for your guests. A QR code will be generated automatically.">
          Create Event Name
        </Title>
        <Input label="Event Name" aria-label="eventName" />
        <Input label="Event Description" aria-label="eventDescription" />
        <Input
          label="Event Date"
          aria-label="eventDate"
          type="date"
          icon={<Calendar />}
        />
        <div className={styles.buttonGroup}>
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary">Next</Button>
        </div>
      </Card>
    </dialog>
  );
};
export default CreateEventCard;
