"use client";

import { RefAttributes, useState } from "react";
import { Button, Dialog, ProgressDots } from "@flash/ui";
import styles from "./CreateEventDialog.module.css";
import { ReviewStep } from "./Steps";
import { useTranslations } from "next-intl";
import { useCreateEventMutation } from "@/hooks/useEvents";
import { FORM_STEPS } from "./Steps/types";
import { CreateEvent, Event } from "@/db";
import { useForm, FormProvider } from "react-hook-form";
import { TIME_PRESETS } from "./types";
import { parseTimeOrDate } from "@/utils/date-utils";

const DEFAULT_FORM_DATA: CreateEvent = {
  name: "",
  description: "",
  uploadLimit: 1,
  // autoApprove: false,
  // seeAllPictures: false,
  startDate: parseTimeOrDate(TIME_PRESETS.full.startTime),
  endDate: parseTimeOrDate(TIME_PRESETS.full.endTime),
};

interface CreateEventDialogProps extends RefAttributes<HTMLDialogElement> {
  onClose?: () => void;
}

export const CreateEventDialog = ({ ref, onClose, ...rest }: CreateEventDialogProps) => {
  const t = useTranslations("common.actions");
  const { mutateAsync, status } = useCreateEventMutation();

  const [formKey, setFormKey] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [eventResult, setEventResult] = useState<Event | null>(null);

  const methods = useForm<CreateEvent>({
    defaultValues: DEFAULT_FORM_DATA,
    mode: "onBlur",
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

  const handleCreate = async () => {
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
