import { CreateEvent } from "@/db";
import { Path } from "react-hook-form";
import { BasicInfoStep, OptionsStep } from "./Steps";

export const TIME_PRESETS = {
  full: { startTime: "00:00", endTime: "23:59" },
  specific: { startTime: "08:00", endTime: "17:00" },
};

export type TimePreset = keyof typeof TIME_PRESETS;
export type EventTime = (typeof TIME_PRESETS)[TimePreset];

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
