import { DatabaseService, dbService } from "./databaseService";
import {
  CreateEvent,
  Event,
  eventCodeTable,
  eventTable,
  GetEventCode,
  GetEvents,
  UpdateEvent,
} from "@/db";
import { AsyncResult, Result } from "typescript-result";
import { getFirstRow } from "@/lib/utils/sql";
import { and, eq, like, inArray, lt, lte, gte, gt, exists, SQL } from "drizzle-orm";
import { makeGlobal } from "@/lib/utils/makeGlobal";

export class EventService {
  private readonly dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  /**
   * Fetches all events in the database that match the given filters.
   * All combinations of filters are supported.
   * If multiple filters are present they are combined with `and`.
   *
   * @param filters The filters to apply to the query.
   * @returns A result with a list of events or an error.
   */
  getEvents({
    id,
    name,
    guestCode,
    moderatorCode,
    status,
    archived,
  }: GetEvents = {}): AsyncResult<Event[], Error> {
    const now = new Date();

    const hasCode = (code: string, moderator: boolean): SQL =>
      exists(
        this.dbService.db
          .select()
          .from(eventCodeTable)
          .where(
            and(
              eq(eventCodeTable.eventId, eventTable.id),
              eq(eventCodeTable.code, code),
              eq(eventCodeTable.isModerator, moderator)
            )
          )
      );

    return Result.try(() =>
      this.dbService.db
        .select()
        .from(eventTable)
        .where(
          and(
            id !== undefined ? inArray(eventTable.id, id) : undefined,
            name !== undefined ? like(eventTable.name, `%${name}%`) : undefined,
            guestCode !== undefined ? hasCode(guestCode, false) : undefined,
            moderatorCode !== undefined ? hasCode(moderatorCode, true) : undefined,
            archived !== undefined ? eq(eventTable.isArchived, archived) : undefined,
            status === "upcoming" ? gt(eventTable.startDate, now) : undefined,
            status === "active"
              ? and(lte(eventTable.startDate, now), gte(eventTable.endDate, now))
              : undefined,
            status === "finished" ? lt(eventTable.endDate, now) : undefined
          )
        )
    );
  }

  getEventCode(eventId: string, { role }: GetEventCode): AsyncResult<string, Error> {
    return Result.try(() =>
      this.dbService.db
        .select({ code: eventCodeTable.code })
        .from(eventCodeTable)
        .where(
          and(
            eq(eventCodeTable.eventId, eventId),
            eq(eventCodeTable.isModerator, role === "moderator")
          )
        )
        .limit(1)
    )
      .map(rows => getFirstRow(rows))
      .map(row => row.code);
  }

  /**
   * Creates a new event in the database.
   * Returns the newly created event.
   *
   * @param data The data of the event to create.
   * @returns A result with the newly created event or an error.
   */
  createEvent(data: CreateEvent): AsyncResult<Event, Error> {
    return Result.try(() => this.dbService.db.insert(eventTable).values(data).returning())
      .map(rows => getFirstRow(rows, "Unable to create event"))
      .onSuccess(() => this.dbService.flush());
  }

  /**
   * Updates an existing event in the database.
   * Returns the updated event.
   *
   * @param eventId The id of the event to update.
   * @param data The data of the event to update.
   * @returns A result with the updated event or an error.
   */
  updateEvent(eventId: string, data: UpdateEvent): AsyncResult<Event, Error> {
    return Result.try(() =>
      this.dbService.db
        .update(eventTable)
        .set(data)
        .where(eq(eventTable.id, eventId))
        .returning()
    )
      .map(rows => getFirstRow(rows, "Unable to update event"))
      .onSuccess(() => this.dbService.flush());
  }

  /**
   * Deletes an event from the database.
   * Returns the deleted event.
   *
   * @param eventId The id of the event to delete.
   * @return A result with the deleted event or an error.
   */
  deleteEvent(eventId: string): AsyncResult<Event, Error> {
    return Result.try(() =>
      this.dbService.db.delete(eventTable).where(eq(eventTable.id, eventId)).returning()
    )
      .map(rows => getFirstRow(rows, "Unable to delete event"))
      .onSuccess(() => this.dbService.flush());
  }
}

export const eventService = makeGlobal("eventService", () => new EventService(dbService));
