import { Event } from "@/db";

export const hasEnded = (eventData: Pick<Event, "endDate">): boolean =>
  eventData ? new Date() > eventData.endDate : false;

export const getEventName = (
  eventData: Pick<Event, "name"> | undefined,
  isLoading: boolean,
  t: (key: string) => string
): string => {
  if (eventData?.name) return eventData.name;
  return isLoading ? t("loadingEvent") : t("eventFallbackName");
};

export const getUploadsRemaining = (
  eventData: Pick<Event, "uploadLimit"> | undefined,
  userImageCount: number
): number | undefined => {
  if (typeof eventData?.uploadLimit !== "number") return undefined;
  return Math.max(0, eventData.uploadLimit - userImageCount);
};
