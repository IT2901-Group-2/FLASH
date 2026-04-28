import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { AsyncResult, Result } from "typescript-result";
import { FileStorage } from "@flash/file-storage";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Sqlite from "better-sqlite3";
import { storage } from "@/config/storage";
import * as schema from "@/db";
import upath from "upath";
import { makeGlobal } from "@/lib/utils/makeGlobal";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Service for managing the database.
 * Database creation and flushing should only be done through this service.
 */
export class DatabaseService {
  public static readonly DRIZZLE_MIGRATION_FOLDER: string = "drizzle";
  private readonly storage: FileStorage;
  private readonly dbPath: string;

  private _db: Database | null = null;
  private flushPromise: Promise<void> | null = null;
  private dirty: boolean = false;

  /**
   * Creates a `DatabaseService` instance associated with a `FileStorage` instance.
   *
   * @param storage The `FileStorage` object to read from/write to.
   * @param dbPath The path to save the database as.
   */
  constructor(storage: FileStorage, dbPath: string = "index.db") {
    this.storage = storage;
    this.dbPath = dbPath;
  }

  get db(): Database {
    if (this._db === null) {
      throw new Error("DatabaseService used before initialization");
    }

    return this._db;
  }

  /**
   * Applies the drizzle SQL migration to a database.
   * This is the function that creates the neccessary tables.
   *
   * @param db The database to migrate.
   * @returns A result with the database or an error.
   */
  private static migrateDatabase<D extends Database>(db: D): Result<D, Error> {
    return Result.try(() => {
      migrate(db, {
        migrationsFolder: upath.join(process.cwd(), this.DRIZZLE_MIGRATION_FOLDER),
      });
      return db;
    });
  }

  /**
   * Initializes the `DatabaseService` instance.
   * Attempts to read the database from `FileStorage` at `dbPath`, otherwise creates a new database.
   * Also migrates the database schema if neccessary.
   *
   * @returns A result indicating whether an existing database was loaded or an error.
   */
  initialize(): AsyncResult<boolean, Error> {
    let loaded = true;

    return this.storage
      .read(this.dbPath)
      .map(buf => new Sqlite(buf))
      .onFailure(() => {
        loaded = false;
      })
      .recoverCatching(() => new Sqlite(":memory:"))
      .map(client => drizzle(client, { schema }))
      .map(db => DatabaseService.migrateDatabase(db))
      .map(db => {
        this._db = db;
      })
      .map(() => loaded);
  }

  /**
   * Flushes the database to storage.
   */
  private async flushDatabase(): Promise<void> {
    this.dirty = false;
    await this.storage.write(this.dbPath, this.db.$client.serialize()).getOrThrow();
    this.flushPromise = this.dirty ? this.flushDatabase() : null;
  }

  /**
   * Marks the database as dirty and queues up a flush.
   */
  flush(): void {
    this.dirty = true;
    this.flushPromise ??= this.flushDatabase();
  }
}

export const dbService = makeGlobal("dbService", () => new DatabaseService(storage));
