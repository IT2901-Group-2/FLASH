import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { AsyncResult, Result } from "typescript-result";
import { FileStorage, FSStorage } from "file-storage";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Sqlite from "better-sqlite3";
import * as schema from "@/db";
import { tmpdir } from "os";
import upath from "upath";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export class DatabaseService {
  public static readonly DRIZZLE_MIGRATION_FOLDER: string = "drizzle";

  private readonly storage: FileStorage;
  private readonly dbPath: string;
  public readonly db: Database;

  private flushPromise: Promise<void> | null = null;
  private dirty: boolean = false;

  constructor(storage: FileStorage, db: Database, dbPath: string = "index.db") {
    this.storage = storage;
    this.db = db;
    this.dbPath = dbPath;
  }

  private static migrateDatabase<D extends Database>(db: D): Result<D, Error> {
    return Result.try(() => {
      migrate(db, {
        migrationsFolder: upath.join(process.cwd(), this.DRIZZLE_MIGRATION_FOLDER),
      });
      return db;
    });
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
      .map(db => this.migrateDatabase(db))
      .map(db => new DatabaseService(storage, db, dbPath));
  }

  private async flushDatabase(): Promise<void> {
    this.dirty = false;
    await this.storage.write(this.dbPath, this.db.$client.serialize()).getOrThrow();
    this.flushPromise = this.dirty ? this.flushDatabase() : null;
  }

  flush(): void {
    this.dirty = true;
    this.flushPromise ??= this.flushDatabase();
  }
}

const storage = new FSStorage(upath.join(tmpdir(), "foto-app"));
export const dbService = await DatabaseService.create(storage).getOrThrow();
