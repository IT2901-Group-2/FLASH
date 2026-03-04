import { RefAttributes, useRef, useState } from "react";
import { Button, Dialog, ProgressDots } from "ui";
import styles from "./CreateEventCard.module.css";
import { BasicInfoStep, OptionsStep, ReviewStep } from "./Steps";
import { useTranslations } from "next-intl";
import { useCreateEventMutation } from "@/hooks/useEvents";
import { FormStepConfig } from "./Steps/types";
export type { StepProps } from "./Steps/types";
import { Event, CreateEvent } from "@/db";

const DEFAULT_FORM_DATA: CreateEvent = {
  name: "",
  description: "",
  uploadLimit: 1,
  // autoApprove: false,
  // seeAllPictures: false,
  startDate: new Date(),
  endDate: new Date(),
};

/**
 * Ordered form steps for event creation.
 * Each step declares its validity constraints via standard HTML attributes
 * (`required`, `min`, `type`, etc.) on its inputs. The card calls
 * `form.reportValidity()` before advancing, which triggers browser-native
 * error messages and blocks navigation if any constraint is violated.
 */
const FORM_STEPS: FormStepConfig[] = [
  { Component: BasicInfoStep },
  { Component: OptionsStep },
];

interface CreateEventCardProps extends RefAttributes<HTMLDialogElement> {
  onClose: () => void;
}

export const CreateEventCard = ({ ref, onClose, ...rest }: CreateEventCardProps) => {
  const t = useTranslations("admin.dashboard.event.create");
  const { mutateAsync, status } = useCreateEventMutation();

  const formRef = useRef<HTMLFormElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [formData, setFormData] = useState<CreateEvent>(DEFAULT_FORM_DATA);
  const [eventResult, setEventResult] = useState<Event | null>(null);
  const updateFormData = <K extends keyof CreateEvent>(field: K, value: CreateEvent[K]) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const isOnReviewStep = currentStepIndex >= FORM_STEPS.length;
  const isOnFirstStep = currentStepIndex === 0;
  const isOnLastFormStep = currentStepIndex === FORM_STEPS.length - 1;

  const currentStep = FORM_STEPS[currentStepIndex];

  /** Validates the current step's inputs and advances if they all pass. */
  const tryGoToNextStep = () => {
    if (formRef.current?.reportValidity()) {
      setCurrentStepIndex(i => i + 1);
    }
  };

  const goToPreviousStep = () => setCurrentStepIndex(i => i - 1);

  const handleCreate = async () => {
    if (!formRef.current?.reportValidity()) return;
    // Advance to review immediately so the loader is shown during the request.
    setCurrentStepIndex(i => i + 1);
    const result = await mutateAsync(formData);
    setEventResult(result);
  };

  const handleClose = () => {
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStepIndex(0);
    setEventResult(null);
    onClose();
  };

  const totalSteps = FORM_STEPS.length + 1;

  return (
    <Dialog ref={ref} {...rest}>
      <ProgressDots
        maxValue={totalSteps}
        value={currentStepIndex + 1}
        data-color="brand-purple"
      />
      <form className={styles.form} ref={formRef} noValidate>
        {isOnReviewStep ? (
          <ReviewStep status={status} result={eventResult} />
        ) : (
          currentStep && (
            <currentStep.Component formData={formData} updateFormData={updateFormData} />
          )
        )}

        <div className={styles.buttonGroup}>
          {!isOnReviewStep && (
            <Button variant="tertiary" onClick={handleClose}>
              {t("cancel")}
            </Button>
          )}
          {!isOnReviewStep && !isOnFirstStep && (
            <Button variant="secondary" onClick={goToPreviousStep}>
              {t("previous")}
            </Button>
          )}
          {!isOnReviewStep && !isOnLastFormStep && (
            <Button variant="secondary" onClick={tryGoToNextStep}>
              {t("next")}
            </Button>
          )}
          {!isOnReviewStep && isOnLastFormStep && (
            <Button variant="secondary" onClick={handleCreate}>
              {t("create")}
            </Button>
          )}
          {isOnReviewStep && (
            <Button variant="primary" data-color="brand-purple" onClick={handleClose}>
              {t("finish")}
            </Button>
          )}
        </div>
      </form>
    </Dialog>
  );
};
export default CreateEventCard;
