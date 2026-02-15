import { Database, DatabaseService, dbService } from "./databaseService";
import { CreateEvent, Event, eventTable, UpdateEvent } from "@/db";
import { AsyncResult, Result } from "typescript-result";
import { getFirstRow } from "@/lib/utils/sql";
import { eq } from "drizzle-orm";

export class EventService {
  private readonly dbService: DatabaseService;
  private readonly db: Database;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
    this.db = dbService.db;
  }

  getEvents(): AsyncResult<Event[], Error> {
    return Result.try(() => this.db.select().from(eventTable));
  }

  createEvent(data: CreateEvent): AsyncResult<Event, Error> {
    return Result.try(() => this.db.insert(eventTable).values(data).returning())
      .map(rows => getFirstRow(rows, "Unable to create event"))
      .onSuccess(() => this.dbService.flush());
  }

  updateEvent(eventId: string, data: UpdateEvent): AsyncResult<Event, Error> {
    return Result.try(() =>
      this.db.update(eventTable).set(data).where(eq(eventTable.id, eventId)).returning()
    )
      .map(rows => getFirstRow(rows, "Unable to update event"))
      .onSuccess(() => this.dbService.flush());
  }

  deleteEvent(eventId: string): AsyncResult<Event, Error> {
    return Result.try(() =>
      this.db.delete(eventTable).where(eq(eventTable.id, eventId)).returning()
    )
      .map(rows => getFirstRow(rows, "Unable to delete event"))
      .onSuccess(() => this.dbService.flush());
  }
}

export const eventService = new EventService(dbService);
