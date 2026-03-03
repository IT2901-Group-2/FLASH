import { CreateEventInput, EventDTO } from "@/types/eventTypes";

/**
 * Props shared by all form steps (BasicInfo, Options).
 * ReviewStep intentionally does NOT use these since it has no editable form data.
 */
export interface StepProps {
  formData: CreateEventInput;
  updateFormData: <K extends keyof CreateEventInput>(
    field: K,
    value: CreateEventInput[K]
  ) => void;
}

/**
 * Props for the ReviewStep, which displays the result of a newly created event.
 * Kept separate from StepProps because ReviewStep is read-only and can be
 * rendered standalone (e.g. to view a QR code outside the creation wizard).
 */
export interface ReviewStepProps {
  status: "idle" | "pending" | "success" | "error";
  result: EventDTO | null | undefined;
}

/**
 * Defines a single step in the multi-step event form.
 * Validation is handled by HTML's built-in constraint validation API —
 * each step declares its validity via `required`, `min`, `type`, etc. on its inputs.
 * The card calls `form.reportValidity()` before advancing to the next step.
 */
export interface FormStepConfig {
  Component: React.ComponentType<StepProps>;
}
