import { CreateEvent, Event, eventTable, UpdateEvent } from "@/db";
import { AsyncResult, Result } from "typescript-result";
import { Database, DatabaseService, dbService } from "./databaseService";
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
      .map(rows =>
        rows[0] ? Result.ok(rows[0]) : Result.error(new Error("Could not create event"))
      )
      .map(event => {
        this.dbService.flush();
        return event;
      });
  }

  updateEvent(eventId: string, data: UpdateEvent): AsyncResult<Event, Error> {
    return Result.try(() =>
      this.db.update(eventTable).set(data).where(eq(eventTable.id, eventId)).returning()
    )
      .map(rows =>
        rows[0] ? Result.ok(rows[0]) : Result.error(new Error("Could not update event"))
      )
      .map(event => {
        this.dbService.flush();
        return event;
      });
  }

  deleteEvent(eventId: string): AsyncResult<Event, Error> {
    return Result.try(() =>
      this.db.delete(eventTable).where(eq(eventTable.id, eventId)).returning()
    )
      .map(rows =>
        rows[0] ? Result.ok(rows[0]) : Result.error(new Error("Could not delete event"))
      )
      .map(event => {
        this.dbService.flush();
        return event;
      });
  }
}

export const eventService = new EventService(dbService);
