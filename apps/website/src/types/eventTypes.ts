import type { Event, CreateEvent, UpdateEvent } from "@/db";

/**
 * This type is used when building the query string when fetching events.
 * Every field is optional, so it means you don't need add a search param when fetching events.
 * The id field is an array so you can fetch multiple specific events in one request.
 * Status can be either "upcoming", "active" or "finished"
 * Archived is either true, false or "all", if archived is not defined it defaults to false in the backend
 */
export type EventsQueryParams = {
  id?: string[];
  name?: string;
  guestCode?: string;
  moderatorCode?: string;
  status?: "upcoming" | "active" | "finished";
  archived?: boolean | "all";
};

/**
 * This represents an event as it comes back from the API
 * DTO: Data Transfer Object, an object that carries data between processes
 * We strip the startDate, endDate, createdAt and updatedAt from the Event and turn them into string type
 * because JSON serialization converts Date objects to ISO strings over HTTP, so this type accurately
 * reflects what the frontend actually receives from fetch.
 */
export type EventDto = Omit<
  Event,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * This is the type that gets passed into the create mutation from UI code.
 * Based on CreateEvent (the DB insert type), but date fields are typed as Date objects
 * rather than strings. Since the application code works with real dates.
 * The Mutation hook's toIso() helper converts them to ISO strings before sending to the API.
 */
export type CreateEventInput = Omit<CreateEvent, "startDate" | "endDate"> & {
  startDate: Date;
  endDate: Date;
};

/**
 * Same as CreateEventInput but for partial updates (PATCH).
 * All fields are optional, since you only need to include the fields
 * you wish to change.
 */
export type UpdateEventInput = Omit<UpdateEvent, "startDate" | "endDate"> & {
  startDate?: Date;
  endDate?: Date;
};
