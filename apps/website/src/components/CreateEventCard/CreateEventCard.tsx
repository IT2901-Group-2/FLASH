import { RefAttributes, useState } from "react";
import { Button, Card, Controls, DropdownControls, Input, Switch, Title } from "ui";
import styles from "./CreateEventCard.module.css";
import { Calendar } from "lucide-react";

// TODO: This will change when create event endpoint is done
type LocalForm = {
  name: string;
  description: string;
  date: string;
  photosPerGuest: number;
  autoApprove: boolean;
  code: string;
};

interface CreateEventCardProps extends RefAttributes<HTMLDialogElement> {
  onClose: () => void;
}

interface StepProps {
  formData: LocalForm;
  updateFormData: (field: keyof LocalForm, value: string | number | boolean) => void;
}

const Step1 = ({ formData, updateFormData }: StepProps) => {
  return (
    <>
      <Title description="Set up a new photo event for your guests. A QR code will be generated automatically.">
        Create Event Name
      </Title>
      <Input
        value={formData.name}
        onChange={e => updateFormData("name", e.target.value)}
        label="Event Name"
        aria-label="eventName"
      />
      <Input
        value={formData.description}
        onChange={e => updateFormData("description", e.target.value)}
        label="Event Description"
        aria-label="eventDescription"
      />
      <Input
        value={formData.date}
        onChange={e => updateFormData("date", e.target.value)}
        label="Event Date"
        aria-label="eventDate"
        type="date"
        icon={<Calendar />}
      />
    </>
  );
};

const Step2 = ({ formData, updateFormData }: StepProps) => {
  const [limitMode, setLimitMode] = useState<"limited" | "unlimited">("limited");
  const [autoGenerateCode, setAutoGenerateCode] = useState<boolean>(true);

  return (
    <>
      <Title description="Configure event settings.">Event Settings</Title>
      <DropdownControls
        onChange={setLimitMode}
        options={[
          {
            content: (
              <div className={styles.maxImageContainer}>
                <span>Set max uploads to:</span>
                <Input
                  aria-label="maxImages"
                  type="number"
                  min={0}
                  value={formData.photosPerGuest}
                  onChange={e =>
                    updateFormData(
                      "photosPerGuest",
                      limitMode === "limited" ? e.target.value : 9999
                    )
                  }
                />
              </div>
            ),
            label: "Limited",
            value: "limited",
          },
          {
            label: "Unlimited",
            value: "unlimited",
          },
        ]}
      />
      <Switch position="right">
        <b>Auto-Approve Photos</b>
      </Switch>
      <Switch
        position="right"
        checked={autoGenerateCode}
        onChange={e => setAutoGenerateCode(e.target.checked)}
      >
        <b>Auto Generate Code</b>
      </Switch>
      {!autoGenerateCode && (
        <Input visualSize="small" label="Custom Entry Code" aria-label="manualCode" />
      )}
    </>
  );
};

const Step3 = () => {
  return <></>;
};

export const CreateEventCard = ({ ref, onClose, ...rest }: CreateEventCardProps) => {
  const [progress, setProgress] = useState<number>(1);
  const [formdata, setFormData] = useState<LocalForm>({
    name: "",
    description: "",
    date: "",
    photosPerGuest: 0,
    autoApprove: false,
    code: "",
  });

  const updateFormData = <K extends keyof LocalForm>(k: K, v: LocalForm[K]) =>
    setFormData(prev => ({ ...prev, [k]: v }));

  const steps = [Step1, Step2, Step3] as const;
  const CurrentStep = steps[progress - 1];

  const nextStep = () => setProgress(c => c + 1);
  const prevStep = () => setProgress(c => c - 1);
  const exitForm = () => {
    onClose();
    setProgress(1);
  };

  return (
    <dialog ref={ref} className={styles.container} {...rest} autoFocus>
      <Card className={styles.card}>
        {/* <ProgressDots maxValue={3} value={progress} data-color="brand-purple" /> */}
        <form className={styles.form}>
          <CurrentStep formData={formdata} updateFormData={updateFormData} />
          <div className={styles.buttonGroup}>
            <Button variant="tertiary" onClick={exitForm}>
              Cancel
            </Button>
            {progress < steps.length && (
              <Button variant="secondary" onClick={nextStep}>
                Next
              </Button>
            )}
            {progress >= steps.length && (
              <Button variant="primary" data-color="brand-purple" onClick={exitForm}>
                Finish
              </Button>
            )}
          </div>
        </form>
      </Card>
    </dialog>
  );
};
export default CreateEventCard;
