import { CreateEvent, Database, db, Event, eventTable } from "@/db";
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
    return Result.try(() =>
      this.db
        .insert(eventTable)
        .values(data)
        .returning()
        .then(rows => rows[0])
    )
      .map(event =>
        event ? Result.ok(event) : Result.error(new Error("Could not create event"))
      )
      .map(async event => {
        await this.db.sync();
        return event;
      });
  }
}

export const eventService = new EventService(db);
