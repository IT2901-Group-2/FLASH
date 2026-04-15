import { CreateEvent } from "@/db";
import { parseTimeOrDate } from "@/utils/date-utils";
import { Path } from "react-hook-form";

export type TimePreset = "full" | "specific";
export interface EventTime {
  startTime: string;
  endTime: string;
}

/**
 * Presets for the event time field. "Full Day" is represented by 00:00 to
 * 23:59, while "Specific Time" defaults to 08:00 to 17:00.
 */
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

export const DEFAULT_FORM_DATA: CreateEvent = {
  name: "",
  description: "",
  uploadLimit: 1,
  autoApprove: false,
  uploadsArePrivate: false,
  startDate: parseTimeOrDate(TIME_PRESETS.full.startTime),
  endDate: parseTimeOrDate(TIME_PRESETS.full.endTime),
};
