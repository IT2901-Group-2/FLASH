import { Event } from "@/db";

/**
 * Checks if the event has ended or not
 *
 * @param eventData The data for the event
 * @returns a boolean indicating if the event has ended or not
 */
export const hasEnded = (eventData: Pick<Event, "endDate"> | undefined): boolean =>
  eventData ? new Date() > eventData.endDate : false;

/**
 * Returns the number of uploads remaining
 *
 * @param eventData The data for the event
 * @param userImageCount The number of photos uploaded by the user untul now
 * @returns The number of photos the user can upload or undefined if unlimited
 */
export const getUploadsRemaining = (
  eventData: Pick<Event, "uploadLimit"> | undefined,
  userImageCount: number
): number | undefined => {
  if (typeof eventData?.uploadLimit !== "number") return undefined;
  return Math.max(0, eventData.uploadLimit - userImageCount);
};
