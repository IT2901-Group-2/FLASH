import { BasicInfoStep, OptionsStep } from "./Steps";
import { FormStepConfig } from "./defaults";

export const FORM_STEPS: FormStepConfig[] = [
  { Component: BasicInfoStep, fields: ["name", "startDate", "endDate"] },
  { Component: OptionsStep, fields: ["uploadLimit"] },
];
