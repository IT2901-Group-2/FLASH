import type { Event, CreateEvent, UpdateEvent } from "@/db";

export type EventsQueryParams = {
  id?: string[];
  name?: string;
  guestCode?: string;
  moderatorCode?: string;
  status?: "upcoming" | "active" | "finished";
  archived?: boolean | "all";
};

export type EventDto = Omit<
  Event,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEventInput = Omit<CreateEvent, "startDate" | "endDate"> & {
  startDate: Date | string;
  endDate: Date | string;
};

export type UpdateEventInput = Omit<UpdateEvent, "startDate" | "endDate"> & {
  startDate?: Date | string;
  endDate?: Date | string;
};
