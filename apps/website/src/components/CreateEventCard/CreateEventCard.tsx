import { RefAttributes, useState } from "react";
import { Button, Card, ProgressDots } from "ui";
import styles from "./CreateEventCard.module.css";
import { BasicInfoStep, OptionsStep, ReviewStep } from "./Steps";
import { useTranslations } from "next-intl";
import { useCreateEventMutation } from "@/hooks/useEvents";
import { CreateEventInput, EventDto } from "@/types/eventTypes";

const DefaultFormData: CreateEventInput = {
  name: "",
  description: "",
  uploadLimit: 1,
  startDate: new Date(),
  endDate: new Date(),
};

interface CreateEventCardProps extends RefAttributes<HTMLDialogElement> {
  onClose: () => void;
}

export interface StepProps {
  formData: CreateEventInput;
  updateFormData: (
    field: keyof CreateEventInput,
    value: CreateEventInput[keyof CreateEventInput]
  ) => void;
  status?: "idle" | "pending" | "success" | "error";
  result?: EventDto | null;
}

export const CreateEventCard = ({ ref, onClose, ...rest }: CreateEventCardProps) => {
  const t = useTranslations("admin.dashboard.event.create");
  const { mutateAsync, status } = useCreateEventMutation();

  const [progress, setProgress] = useState<number>(1);
  const [formdata, setFormData] = useState<CreateEventInput>(DefaultFormData);
  const [eventResult, setEventResult] = useState<EventDto | null>(null);

  const updateFormData = <K extends keyof CreateEventInput>(
    k: K,
    v: CreateEventInput[K]
  ) => setFormData(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
    await mutateAsync(formdata).then(setEventResult);
  };

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
  const isSecondToLastStep = progress === steps.length - 1;
  return (
    <dialog ref={ref} className={styles.container} {...rest} autoFocus>
      <Card className={styles.card}>
        <ProgressDots maxValue={3} value={progress} data-color="brand-purple" />
        <form className={styles.form}>
          <CurrentStep
            formData={formdata}
            updateFormData={updateFormData}
            status={status}
            result={eventResult}
          />
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
            {!isLastStep && !isSecondToLastStep && (
              <Button variant="secondary" onClick={nextStep}>
                {t("next")}
              </Button>
            )}
            {isSecondToLastStep && (
              <Button variant="secondary" onClick={handleSubmit}>
                {t("create")}
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
