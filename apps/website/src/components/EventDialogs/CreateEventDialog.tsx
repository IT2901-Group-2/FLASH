"use client";

import { MouseEvent, RefAttributes, useState } from "react";
import { Button, Dialog, ProgressDots, Title } from "@flash/ui";
import styles from "./CreateEventDialog.module.css";
import { ReviewStep } from "./Steps";
import { useTranslations } from "next-intl";
import { useCreateEventMutation } from "@/hooks/useEvents";
import { FORM_STEPS } from "./formSteps";
import { CreateEvent, Event } from "@/db";
import { useForm, FormProvider } from "react-hook-form";
import { DEFAULT_FORM_DATA } from "./defaults";

interface CreateEventDialogProps extends RefAttributes<HTMLDialogElement> {
  onClose?: () => void;
}

export const CreateEventDialog = ({ ref, onClose, ...rest }: CreateEventDialogProps) => {
  const t = useTranslations("common.actions");
  const tTitle = useTranslations("admin.dashboard.event.basics.create");
  const { mutateAsync, status } = useCreateEventMutation();

  const [formKey, setFormKey] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [eventResult, setEventResult] = useState<Event | null>(null);

  const methods = useForm<CreateEvent>({
    defaultValues: DEFAULT_FORM_DATA,
    mode: "onChange",
  });

  const isOnReviewStep = currentStepIndex >= FORM_STEPS.length;
  const isOnFirstStep = currentStepIndex === 0;
  const isOnLastFormStep = currentStepIndex === FORM_STEPS.length - 1;

  const currentStep = FORM_STEPS[currentStepIndex];

  /** Validates the current step's inputs and advances if they all pass. */
  const tryGoToNextStep = async () => {
    if (!currentStep) return;
    if (await methods.trigger(currentStep.fields)) setCurrentStepIndex(i => i + 1);
  };

  const goToPreviousStep = () => setCurrentStepIndex(i => i - 1);

  const handleCreate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentStep) return;
    if (!(await methods.trigger(currentStep.fields))) return;
    setCurrentStepIndex(i => i + 1);
    const result = await mutateAsync(methods.getValues());
    setEventResult(result);
  };

  const handleClose = () => {
    methods.reset(DEFAULT_FORM_DATA);
    setCurrentStepIndex(0);
    setEventResult(null);
    setFormKey(i => i + 1);
    onClose?.();
    if (ref && typeof ref !== "function") ref.current?.close();
  };

  const totalSteps = FORM_STEPS.length + 1;

  return (
    <Dialog ref={ref} closedby="none" {...rest}>
      <ProgressDots
        maxValue={totalSteps}
        value={currentStepIndex + 1}
        data-color="brand-purple"
      />
      <FormProvider {...methods}>
        {isOnFirstStep && (
          <Title description={tTitle("description")}>{tTitle("title")}</Title>
        )}
        <form key={formKey} className={styles.form} noValidate>
          {isOnReviewStep ? (
            <ReviewStep status={status} result={eventResult} />
          ) : (
            currentStep && <currentStep.Component />
          )}

          <div className={styles.buttonGroup}>
            {!isOnReviewStep && (
              <Button
                type="button"
                variant="tertiary"
                data-color="neutral"
                onClick={handleClose}
              >
                {t("cancel")}
              </Button>
            )}
            {!isOnReviewStep && !isOnFirstStep && (
              <Button
                type="button"
                variant="secondary"
                data-color="neutral"
                onClick={goToPreviousStep}
              >
                {t("previous")}
              </Button>
            )}
            {!isOnReviewStep && !isOnLastFormStep && (
              <Button
                type="button"
                variant="secondary"
                data-color="brand-purple"
                onClick={tryGoToNextStep}
              >
                {t("next")}
              </Button>
            )}
            {!isOnReviewStep && isOnLastFormStep && (
              <Button
                type="submit"
                variant="primary"
                data-color="brand-purple"
                onClick={handleCreate}
              >
                {t("create")}
              </Button>
            )}
            {isOnReviewStep && (
              <Button
                type="button"
                variant="primary"
                data-color="brand-purple"
                onClick={handleClose}
              >
                {t("finish")}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
};
export default CreateEventDialog;
