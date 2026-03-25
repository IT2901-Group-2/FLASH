import { DatabaseService, dbService } from "./databaseService";
import {
  CreateEvent,
  Event,
  EventCode,
  eventCodeTable,
  eventTable,
  GetEventCodeParams,
  GetEventsPage,
  GetEventsParams,
  UpdateEvent,
  userTable,
} from "@/db";
import { AsyncResult, Result } from "typescript-result";
import { getFirstRow } from "@/lib/utils/sql";
import { and, eq, like, inArray, lt, lte, gte, gt, desc, asc } from "drizzle-orm";
import { makeGlobal } from "@/lib/utils/makeGlobal";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";
import { HTTPError } from "@/lib/utils/error";
import { ADMIN_ID } from "@/config";

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
    status,
    archived,
    sortBy,
    order,
    cursor,
    pageSize = 20,
  }: GetEventsParams = {}): AsyncResult<GetEventsPage, Error> {
    const now = new Date();
    const offset = cursor ?? 0;

    const sortOrder = order === "descending" ? desc : asc;
    const sortColumnMap: Record<NonNullable<GetEventsParams["sortBy"]>, SQLiteColumn> = {
      name: eventTable.name,
      description: eventTable.description,
      startDate: eventTable.startDate,
      endDate: eventTable.endDate,
      uploadLimit: eventTable.uploadLimit,
      createdAt: eventTable.createdAt,
      updatedAt: eventTable.updatedAt,
    };
    const sortColumn =
      sortBy !== undefined ? sortColumnMap[sortBy] : sortColumnMap.createdAt;

    return Result.try(async () => {
      const baseQuery = this.dbService.db
        .select()
        .from(eventTable)
        .where(
          and(
            id !== undefined ? inArray(eventTable.id, id) : undefined,
            name !== undefined ? like(eventTable.name, `%${name}%`) : undefined,
            archived !== undefined ? eq(eventTable.isArchived, archived) : undefined,
            status === "upcoming" ? gt(eventTable.startDate, now) : undefined,
            status === "active"
              ? and(lte(eventTable.startDate, now), gte(eventTable.endDate, now))
              : undefined,
            status === "finished" ? lt(eventTable.endDate, now) : undefined
          )
        );

      const rows = await baseQuery
        .orderBy(sortOrder(sortColumn), sortOrder(eventTable.id))
        .offset(offset)
        .limit(pageSize + 1);

      const hasMore = rows.length > pageSize;
      const items = hasMore ? rows.slice(0, pageSize) : rows;

      return {
        items,
        nextCursor: hasMore ? offset + pageSize : null,
      };
    });
  }

  /**
   * Fetches the join code for the specified event.
   * Fethes the guest code if `role` is 'guest' and the moderator code if `role` is 'moderator'.
   *
   * @param eventId The event to fetch the code for.
   * @param options The type of join code to fetch.
   * @returns A code that can be used to join the specified event.
   */
  getEventCode(
    eventId: string,
    { role }: GetEventCodeParams
  ): AsyncResult<string, Error> {
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
   * Fetches an `EventCode` object from an event code.
   * The `EventCode` contains all necessary information for joining an event.
   *
   * @param code The code to fetch the `EventCode` object for.
   * @returns A result with an `EventCode` object or an error.
   */
  getEventByCode(code: string): AsyncResult<EventCode, Error> {
    return Result.try(() =>
      this.dbService.db
        .select()
        .from(eventCodeTable)
        .where(eq(eventCodeTable.code, code))
        .limit(1)
    )
      .map(rows => getFirstRow(rows, `Unable to find event with code: ${code}`))
      .mapError(err => new HTTPError(err.message, 404));
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
      .map(event =>
        Result.try(() =>
          this.dbService.db
            .insert(eventCodeTable)
            .values([
              { eventId: event.id, isModerator: true },
              { eventId: event.id, isModerator: false },
            ])
            .returning()
        )
          .map(rows =>
            rows.length === 2
              ? Result.ok(event)
              : Result.error(new Error("Unable to create event codes"))
          )
          .onFailure(async () => {
            await this.dbService.db.delete(eventTable).where(eq(eventTable.id, event.id));
          })
      )
      .map(event =>
        Result.try(() =>
          this.dbService.db
            .insert(userTable)
            .values({
              id: `${ADMIN_ID}-${event.id}`,
              eventId: event.id,
              name: "Admin",
              isModerator: true,
            })
            .returning()
        ).map(() => event)
      )
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
