import { BasicInfoStep, OptionsStep } from "./Steps";
import { FormStepConfig } from "./defaults";

/**
 * The configuration for each step of the multi-step event form. Each step
 * declares which fields it contains, which allows the form to validate only
 * those fields when advancing to the next step.
 *
 * It needs to be here to not get a circular dependency.
 */
export const FORM_STEPS: FormStepConfig[] = [
  { Component: BasicInfoStep, fields: ["name", "startDate", "endDate"] },
  { Component: OptionsStep, fields: ["uploadLimit"] },
];
