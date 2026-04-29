import { Event } from "@/db";

export const hasEnded = (eventData: Pick<Event, "endDate"> | undefined): boolean =>
  eventData ? new Date() > eventData.endDate : false;

export const getUploadsRemaining = (
  eventData: Pick<Event, "uploadLimit"> | undefined,
  userImageCount: number
): number | undefined => {
  if (typeof eventData?.uploadLimit !== "number") return undefined;
  return Math.max(0, eventData.uploadLimit - userImageCount);
};
