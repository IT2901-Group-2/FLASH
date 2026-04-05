import { CreateEvent, Event } from "@/db";
import { Path } from "react-hook-form";
import BasicInfoStep from "./BasicInfoStep";
import OptionsStep from "./OptionsStep";

/**
 * Props for the ReviewStep, which displays the result of a newly created event.
 * Kept separate from StepProps because ReviewStep is read-only and can be
 * rendered standalone (e.g. to view a QR code outside the creation wizard).
 */
export interface ReviewStepProps {
  status: "idle" | "pending" | "success" | "error";
  result: Event | null | undefined;
}

/**
 * Defines a single step in the multi-step event form.
 * Validation is handled by HTML's built-in constraint validation API —
 * each step declares its validity via `required`, `min`, `type`, etc. on its inputs.
 * The card calls `form.reportValidity()` before advancing to the next step.
 */
export interface FormStepConfig {
  Component: () => React.JSX.Element;
  fields: Path<CreateEvent>[];
}

export const FORM_STEPS: FormStepConfig[] = [
  { Component: BasicInfoStep, fields: ["name", "startDate", "endDate"] },
  { Component: OptionsStep, fields: ["uploadLimit"] },
];
