import { CreateEvent } from "@/db";
import { Path } from "react-hook-form";

export type TimePreset = "full" | "specific";
export interface EventTime {
  startTime: string;
  endTime: string;
}

export const TIME_PRESETS: Record<TimePreset, EventTime> = {
  full: { startTime: "00:00", endTime: "23:59" },
  specific: { startTime: "08:00", endTime: "17:00" },
};

/**
 * Defines a single step in the multi-step event form.
 * Validation is handled by HTML's built-in constraint validation API —
 * each step declares its validity via `required`, `min`, `type`, etc. on its inputs.
 * The card calls `form.reportValidity()` before advancing to the next step.
 */
export interface FormStepConfig {
  Component: React.ComponentType;
  fields: Path<CreateEvent>[];
}
