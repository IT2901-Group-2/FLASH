import { RefAttributes, useState } from "react";
import { Button, Card, ProgressDots } from "ui";
import styles from "./CreateEventCard.module.css";
import { BasicInfoStep, OptionsStep, ReviewStep } from "./Steps";

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

export interface StepProps {
  formData: LocalForm;
  updateFormData: (field: keyof LocalForm, value: string | number | boolean) => void;
}

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

  const steps = [BasicInfoStep, OptionsStep, ReviewStep] as const;
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
        <ProgressDots maxValue={3} value={progress} data-color="brand-purple" />
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
