import { RefAttributes, useState } from "react";
import { Button, Dialog, ProgressDots } from "@flash/ui";
import { useTranslations } from "next-intl";
import { useUpdateEventMutation } from "@/hooks/useEvents";
import { FORM_STEPS } from "./types";
import styles from "./CreateEventDialog.module.css";
import { Event, UpdateEvent } from "@/db";
import { FormProvider, useForm } from "react-hook-form";

interface EditEventDialogProps extends RefAttributes<HTMLDialogElement> {
  event: Event;
  onClose?: () => void;
}

export const EditEventDialog = ({
  ref,
  event,
  onClose,
  ...rest
}: EditEventDialogProps) => {
  const t = useTranslations("common.actions");
  const { mutateAsync, status } = useUpdateEventMutation();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [formKey, setFormKey] = useState<number>(0);

  const methods = useForm<UpdateEvent>({
    defaultValues: { ...event, uploadLimit: event.uploadLimit ?? undefined },
    mode: "onChange",
  });

  const isOnFirstStep = currentStepIndex === 0;
  const isOnLastStep = currentStepIndex === FORM_STEPS.length - 1;
  const currentStep = FORM_STEPS[currentStepIndex]!;

  const tryGoToNextStep = async () => {
    if (await methods.trigger(currentStep.fields)) setCurrentStepIndex(i => i + 1);
  };

  const goToPreviousStep = () => setCurrentStepIndex(i => i - 1);

  const handleSave = async () => {
    if (!(await methods.trigger(currentStep.fields))) return;
    await mutateAsync({
      eventId: event.id,
      data: {
        ...methods.getValues(),
        uploadLimit: methods.getValues("uploadLimit") ?? null,
      },
    }).then(handleClose);
  };

  const handleClose = () => {
    methods.reset();
    setCurrentStepIndex(0);
    setFormKey(i => i + 1);
    onClose?.();
    if (ref && typeof ref !== "function") ref.current?.close();
  };

  return (
    <Dialog ref={ref} closedby="none" {...rest}>
      <ProgressDots
        maxValue={FORM_STEPS.length}
        value={currentStepIndex + 1}
        data-color="brand-purple"
      />
      <FormProvider {...methods}>
        <form key={formKey} className={styles.form} noValidate>
          {currentStep && <currentStep.Component />}

          <div className={styles.buttonGroup}>
            <Button variant="tertiary" data-color="neutral" onClick={handleClose}>
              {t("cancel")}
            </Button>

            {!isOnFirstStep && (
              <Button variant="secondary" data-color="neutral" onClick={goToPreviousStep}>
                {t("previous")}
              </Button>
            )}

            {!isOnLastStep ? (
              <Button variant="secondary" data-color="neutral" onClick={tryGoToNextStep}>
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
      </FormProvider>
    </Dialog>
  );
};

export default EditEventDialog;
