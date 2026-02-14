import { FileStorage, FSStorage } from "file-storage";
import { tmpdir } from "os";
import upath from "upath";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { schema, eventTable, Database, migrate, CreateEvent, Event } from "@/db";
import Sqlite from "better-sqlite3";
import { AsyncResult, Result } from "typescript-result";

export class DatabaseService {
  private readonly storage: FileStorage;
  private readonly db: Database;
  private readonly dbPath: string;

  constructor(storage: FileStorage, db: Database, dbPath: string = "index.db") {
    this.storage = storage;
    this.db = db;
    this.dbPath = dbPath;
  }

  static create(
    storage: FileStorage,
    dbPath: string = "index.db"
  ): AsyncResult<DatabaseService, Error> {
    return storage
      .read(dbPath)
      .map(buf => new Sqlite(buf))
      .recover(() => new Sqlite(":memory:"))
      .map(client => drizzle(client, { schema }))
      .map(migrate)
      .map(db => new DatabaseService(storage, db, dbPath));
  }

  private sync(): AsyncResult<void, Error> {
    return this.storage.write(this.dbPath, this.db.$client.serialize());
  }

  createEvent(data: CreateEvent): AsyncResult<Event, Error> {
    return Result.try(() => this.db.insert(eventTable).values(data).returning())
      .map(rows =>
        rows[0]
          ? Result.ok(rows[0])
          : Result.error(new Error("Could not create new event"))
      )
      .map(event => this.sync().map(() => event));
  }

  getEvents(): AsyncResult<Event[], Error> {
    return Result.try(() => this.db.select().from(eventTable));
  }
}

const fileStorage = new FSStorage(upath.join(tmpdir(), "foto-app"));
export const dbService = await DatabaseService.create(fileStorage).getOrThrow();
