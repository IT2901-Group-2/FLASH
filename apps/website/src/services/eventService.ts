import { CreateEvent, Database, db, Event, eventTable, UpdateEvent } from "@/db";
import { eq } from "drizzle-orm";
import { AsyncResult, Result } from "typescript-result";

export class EventService {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  getEvents(): AsyncResult<Event[], Error> {
    return Result.try(() => this.db.select().from(eventTable));
  }

  createEvent(data: CreateEvent): AsyncResult<Event, Error> {
    return Result.try(() => this.db.insert(eventTable).values(data).returning())
      .map(rows =>
        rows[0] ? Result.ok(rows[0]) : Result.error(new Error("Could not create event"))
      )
      .map(async event => {
        await this.db.sync();
        return event;
      });
  }

  updateEvent(eventId: string, data: UpdateEvent): AsyncResult<Event, Error> {
    return Result.try(() =>
      this.db.update(eventTable).set(data).where(eq(eventTable.id, eventId)).returning()
    ).map(rows =>
      rows[0] ? Result.ok(rows[0]) : Result.error(new Error("Could not update event"))
    );
  }

  deleteEvent(eventId: string): AsyncResult<void, Error> {
    return Result.try(async () => {
      await this.db.delete(eventTable).where(eq(eventTable.id, eventId));
    });
  }
}

export const eventService = new EventService(db);
