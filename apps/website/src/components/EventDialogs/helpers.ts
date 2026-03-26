import { CreateEvent } from "@/db";
import { EventTime, FormValues, TIME_PRESETS } from "./types";

export const isFullDay = (v: EventTime) =>
  v.startTime === TIME_PRESETS.full.startTime && v.endTime === TIME_PRESETS.full.endTime;

export const combineDateAndTime = (date: Date, timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Date(new Date(date.setHours(hours, minutes, 0, 0)));
};

export const toCreateEvent = (data: FormValues): CreateEvent => {
  const { dateRange, eventTime, ...rest } = data;
  const [startHours, startMinutes] = eventTime.startTime.split(":").map(Number);
  const [endHours, endMinutes] = eventTime.endTime.split(":").map(Number);

  const startDate = new Date(dateRange.startDate!);
  startDate.setHours(startHours, startMinutes, 0, 0);

  const endDate = new Date(dateRange.endDate!);
  endDate.setHours(endHours, endMinutes, 0, 0);

  return { ...rest, startDate, endDate };
};
