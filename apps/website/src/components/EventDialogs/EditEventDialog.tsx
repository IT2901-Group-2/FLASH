import { RefAttributes, useRef, useState } from "react";
import { Button, Dialog, ProgressDots } from "ui";
import { useTranslations } from "next-intl";
import { useUpdateEventMutation } from "@/hooks/useEvents";
import { BasicInfoStep } from "./Steps/BasicInfoStep";
import { OptionsStep } from "./Steps/OptionsStep";
import { FormStepConfig } from "./Steps/types";
import styles from "./CreateEventDialog.module.css";
import { CreateEvent, Event } from "@/db";

const EDIT_STEPS: FormStepConfig[] = [
  { Component: BasicInfoStep },
  { Component: OptionsStep },
];

interface EditEventDialogProps extends RefAttributes<HTMLDialogElement> {
  event: Event;
  onClose: () => void;
}

export const EditEventDialog = ({
  ref,
  event,
  onClose,
  ...rest
}: EditEventDialogProps) => {
  const t = useTranslations("admin.dashboard.event.edit");
  const { mutateAsync, status } = useUpdateEventMutation();

  const formRef = useRef<HTMLFormElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const [formData, setFormData] = useState<CreateEvent>({
    name: event.name,
    description: event.description,
    uploadLimit: event.uploadLimit ?? undefined,
    // autoApprove: event.autoApprove,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
  });

  const updateFormData = <K extends keyof CreateEvent>(field: K, value: CreateEvent[K]) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const isOnFirstStep = currentStepIndex === 0;
  const isOnLastStep = currentStepIndex === EDIT_STEPS.length - 1;
  const currentStep = EDIT_STEPS[currentStepIndex];

  const tryGoToNextStep = () => {
    if (!formRef.current?.reportValidity()) return;
    setCurrentStepIndex(i => i + 1);
  };

  const goToPreviousStep = () => setCurrentStepIndex(i => i - 1);

  const handleSave = async () => {
    if (!formRef.current?.reportValidity()) return;
    // Added as .then(), so its easy to add if there are error popups in the future
    await mutateAsync({ eventId: event.id, data: formData }).then(handleClose);
  };

  const handleClose = () => {
    setCurrentStepIndex(0);
    onClose();
  };

  return (
    <Dialog ref={ref} {...rest}>
      <ProgressDots
        maxValue={EDIT_STEPS.length}
        value={currentStepIndex + 1}
        data-color="brand-purple"
      />
      <form className={styles.form} ref={formRef} noValidate>
        {currentStep && (
          <currentStep.Component formData={formData} updateFormData={updateFormData} />
        )}

        <div className={styles.buttonGroup}>
          <Button variant="tertiary" onClick={handleClose}>
            {t("cancel")}
          </Button>

          {!isOnFirstStep && (
            <Button variant="secondary" onClick={goToPreviousStep}>
              {t("previous")}
            </Button>
          )}

          {!isOnLastStep ? (
            <Button variant="secondary" onClick={tryGoToNextStep}>
              {t("next")}
            </Button>
          ) : (
            <Button
              variant="primary"
              data-color="brand-purple"
              onClick={handleSave}
              disabled={status === "pending"}
            >
              {t("save")}
            </Button>
          )}
        </div>
      </form>
    </Dialog>
  );
};

export default EditEventDialog;
