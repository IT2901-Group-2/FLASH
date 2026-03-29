import { RefAttributes, useState } from "react";
import { Button, Dialog, ProgressDots } from "@flash/ui";
import { useTranslations } from "next-intl";
import { useUpdateEventMutation } from "@/hooks/useEvents";
import { BasicInfoStep } from "./Steps/BasicInfoStep";
import { OptionsStep } from "./Steps/OptionsStep";
import { FormStepConfig } from "./Steps/types";
import styles from "./CreateEventDialog.module.css";
import { CreateEvent, Event, UpdateEvent } from "@/db";
import { FormProvider, useForm } from "react-hook-form";
import { formatTimeForInput } from "@/utils/date-utils";

const FORM_STEPS: FormStepConfig[] = [
  { Component: BasicInfoStep, fields: ["name", "startDate", "endDate"] },
  { Component: OptionsStep, fields: ["uploadLimit"] },
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
  const t = useTranslations("common.actions");
  const { mutateAsync, status } = useUpdateEventMutation();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const methods = useForm<UpdateEvent>({
    defaultValues: event,
    mode: "onChange",
  });

  const isOnFirstStep = currentStepIndex === 0;
  const isOnLastStep = currentStepIndex === FORM_STEPS.length - 1;
  const currentStep = FORM_STEPS[currentStepIndex]!;

  const tryGoToNextStep = async () => {
    if (await methods.trigger(currentStep.fields)) setCurrentStepIndex(i => i + 1);
  };

  const goToPreviousStep = () => setCurrentStepIndex(i => i - 1);

  // const handleSave = async () => {
  //   console.log(event.startDate.toTimeString());
  //   if (!(await methods.trigger(currentStep.fields))) return;
  //   // Added as .then(), so its easy to add if there are error popups in the future
  //   await mutateAsync({
  //     eventId: event.id,
  //     data: toCreateEvent(methods.getValues()),
  //   }).then(handleClose);
  // };

  const handleClose = () => {
    setCurrentStepIndex(0);
    onClose();
  };

  return (
    <Dialog ref={ref} closedby="none" {...rest}>
      <ProgressDots
        maxValue={FORM_STEPS.length}
        value={currentStepIndex + 1}
        data-color="brand-purple"
      />
      <FormProvider {...methods}>
        <form className={styles.form} noValidate>
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
                // onClick={handleSave}
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
