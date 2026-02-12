import { RefAttributes, useState } from "react";
import { Button, Card, Controls, Input, ProgressDots, Title } from "ui";
import styles from "./CreateEventCard.module.css";
import { Calendar } from "lucide-react";

interface CreateEventCardProps extends RefAttributes<HTMLDialogElement> {
  onClose?: () => void;
}

const Step1 = () => {
  return (
    <>
      <Title description="Set up a new photo event for your guests. A QR code will be generated automatically.">
        Create Event Name
      </Title>
      <Input label="Event Name" aria-label="eventName" />
      <Input label="Event Description" aria-label="eventDescription" />
      <Input label="Event Date" aria-label="eventDate" type="date" icon={<Calendar />} />
    </>
  );
};

const Step2 = () => {
  return (
    <>
      <Controls
        options={[
          {
            label: "Enable",
            value: "enable",
          },
          {
            label: "Disable",
            value: "disable",
          },
        ]}
      />
    </>
  );
};

export const CreateEventCard = ({ ref, onClose, ...rest }: CreateEventCardProps) => {
  const [progress, setProgress] = useState<number>(2);

  const steps = [Step1, Step2] as const;
  const CurrentStep = steps[progress - 1];

  return (
    <dialog ref={ref} className={styles.container} {...rest} autoFocus>
      <Card className={styles.card}>
        <ProgressDots maxValue={3} value={progress} data-color="brand-purple" />
        <CurrentStep />
        <div className={styles.buttonGroup}>
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          {progress < steps.length && <Button variant="secondary">Next</Button>}
        </div>
      </Card>
    </dialog>
  );
};
export default CreateEventCard;
