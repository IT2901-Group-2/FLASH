"use client";

import { RefAttributes, useState } from "react";
import { Button, Dialog, ProgressDots } from "@flash/ui";
import styles from "./CreateEventDialog.module.css";
import { BasicInfoStep, OptionsStep, ReviewStep } from "./Steps";
import { useTranslations } from "next-intl";
import { useCreateEventMutation } from "@/hooks/useEvents";
import { FormStepConfig } from "./Steps/types";
import { Event } from "@/db";
import { useForm, FormProvider } from "react-hook-form";
import { FormValues } from "./types";
import { toCreateEvent } from "./helpers";

const DEFAULT_FORM_DATA: FormValues = {
  name: "",
  description: "",
  uploadLimit: 1,
  // autoApprove: false,
  // seeAllPictures: false,
  dateRange: {
    startDate: new Date(),
    endDate: new Date(),
  },
  eventTime: { startTime: "00:00", endTime: "23:59" },
};

/**
 * Ordered form steps for event creation.
 * Each step declares its validity constraints via standard HTML attributes
 * (`required`, `min`, `type`, etc.) on its inputs. The card calls
 * `form.reportValidity()` before advancing, which triggers browser-native
 * error messages and blocks navigation if any constraint is violated.
 */
const FORM_STEPS: FormStepConfig[] = [
  { Component: BasicInfoStep, fields: ["name", "dateRange", "eventTime"] },
  { Component: OptionsStep, fields: ["uploadLimit"] },
];

interface CreateEventDialogProps extends RefAttributes<HTMLDialogElement> {
  onClose: () => void;
}

export const CreateEventDialog = ({ ref, onClose, ...rest }: CreateEventDialogProps) => {
  const t = useTranslations("common.actions");
  const { mutateAsync, status } = useCreateEventMutation();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [eventResult, setEventResult] = useState<Event | null>(null);

  const methods = useForm<FormValues>({
    defaultValues: DEFAULT_FORM_DATA,
    mode: "onTouched",
  });

  const isOnReviewStep = currentStepIndex >= FORM_STEPS.length;
  const isOnFirstStep = currentStepIndex === 0;
  const isOnLastFormStep = currentStepIndex === FORM_STEPS.length - 1;

  const currentStep = FORM_STEPS[currentStepIndex]!;

  /** Validates the current step's inputs and advances if they all pass. */
  const tryGoToNextStep = async () => {
    console.log(await methods.formState.errors);
    if (await methods.trigger(currentStep.fields)) setCurrentStepIndex(i => i + 1);
  };

  const goToPreviousStep = () => setCurrentStepIndex(i => i - 1);

  const handleCreate = async () => {
    if (!(await methods.trigger(currentStep.fields))) return;
    // Advance immediately so the loader shows during the request.
    setCurrentStepIndex(i => i + 1);
    const result = await mutateAsync(toCreateEvent(methods.getValues()));
    setEventResult(result);
  };

  const handleClose = () => {
    methods.reset(DEFAULT_FORM_DATA);
    setCurrentStepIndex(0);
    setEventResult(null);
    onClose();
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
        <form className={styles.form} noValidate>
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
