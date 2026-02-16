import { DatabaseService, dbService } from "./databaseService";
import { CreateEvent, Event, eventTable, GetEvent, UpdateEvent } from "@/db";
import { AsyncResult, Result } from "typescript-result";
import { getFirstRow } from "@/lib/utils/sql";
import { sql, and, eq, like, inArray, lt, lte, gte, gt } from "drizzle-orm";

export class EventService {
  private readonly dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  getEvents({
    id,
    name,
    guestCode,
    moderatorCode,
    status,
    archived,
  }: GetEvent): AsyncResult<Event[], Error> {
    const now = new Date();

    return Result.try(() =>
      this.dbService.db
        .select()
        .from(eventTable)
        .where(
          and(
            id !== undefined ? inArray(eventTable.id, id) : undefined,
            name !== undefined ? like(eventTable.name, sql`%${name}%`) : undefined,
            guestCode !== undefined ? eq(eventTable.guestCode, guestCode) : undefined,
            moderatorCode !== undefined
              ? eq(eventTable.moderatorCode, moderatorCode)
              : undefined,
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

  createEvent(data: CreateEvent): AsyncResult<Event, Error> {
    return Result.try(() => this.dbService.db.insert(eventTable).values(data).returning())
      .map(rows => getFirstRow(rows, "Unable to create event"))
      .onSuccess(() => this.dbService.flush());
  }

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

  deleteEvent(eventId: string): AsyncResult<Event, Error> {
    return Result.try(() =>
      this.dbService.db.delete(eventTable).where(eq(eventTable.id, eventId)).returning()
    )
      .map(rows => getFirstRow(rows, "Unable to delete event"))
      .onSuccess(() => this.dbService.flush());
  }
}

export const eventService = new EventService(dbService);
