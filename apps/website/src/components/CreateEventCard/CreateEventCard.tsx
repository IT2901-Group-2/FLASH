import { RefAttributes, useState } from "react";
import { Button, Card, ProgressDots } from "ui";
import styles from "./CreateEventCard.module.css";
import { BasicInfoStep, OptionsStep, ReviewStep } from "./Steps";
import { useTranslations } from "next-intl";

// TODO: This will change when create event endpoint is done
type LocalForm = {
  name: string;
  description: string;
  date: string;
  photosPerGuest: number;
  autoApprove: boolean;
  code: string;
};
// TODO: This will change when create event endpoint is done
const DefaultFormData = {
  name: "",
  description: "",
  date: "",
  photosPerGuest: 1,
  autoApprove: false,
  code: "",
};

interface CreateEventCardProps extends RefAttributes<HTMLDialogElement> {
  onClose: () => void;
}

export interface StepProps {
  formData: LocalForm;
  updateFormData: (field: keyof LocalForm, value: string | number | boolean) => void;
}

export const CreateEventCard = ({ ref, onClose, ...rest }: CreateEventCardProps) => {
  const t = useTranslations("admin.dashboard.event.create");

  const [progress, setProgress] = useState<number>(1);
  const [formdata, setFormData] = useState<LocalForm>(DefaultFormData);
  const updateFormData = <K extends keyof LocalForm>(k: K, v: LocalForm[K]) =>
    setFormData(prev => ({ ...prev, [k]: v }));

  const steps = [BasicInfoStep, OptionsStep, ReviewStep] as const;
  const CurrentStep = steps[progress - 1]!;

  const nextStep = () => setProgress(c => c + 1);
  const prevStep = () => setProgress(c => c - 1);
  const exitForm = () => {
    setFormData(DefaultFormData);
    setProgress(1);
    onClose();
  };

  const isFirstStep = progress <= 1;
  const isLastStep = progress >= steps.length;
  const isMiddleStep = !isFirstStep && !isLastStep;

  return (
    <dialog ref={ref} className={styles.container} {...rest} autoFocus>
      <Card className={styles.card}>
        <ProgressDots maxValue={3} value={progress} data-color="brand-purple" />
        <form className={styles.form}>
          <CurrentStep formData={formdata} updateFormData={updateFormData} />
          <div className={styles.buttonGroup}>
            {!isLastStep && (
              <Button variant="tertiary" onClick={exitForm}>
                {t("cancel")}
              </Button>
            )}
            {isMiddleStep && (
              <Button variant="secondary" onClick={prevStep}>
                {t("previous")}
              </Button>
            )}
            {!isLastStep && (
              <Button variant="secondary" onClick={nextStep}>
                {t("next")}
              </Button>
            )}
            {isLastStep && (
              <Button variant="primary" data-color="brand-purple" onClick={exitForm}>
                {t("finish")}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </dialog>
  );
};
export default CreateEventCard;
