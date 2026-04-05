import { Event } from "@/db";

/**
 * Props for the ReviewStep, which displays the result of a newly created event.
 * Kept separate from StepProps because ReviewStep is read-only and can be
 * rendered standalone (e.g. to view a QR code outside the creation wizard).
 */
export interface ReviewStepProps {
  status: "idle" | "pending" | "success" | "error";
  result: Event | null | undefined;
}
