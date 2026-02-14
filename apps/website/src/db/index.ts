export * from "./schema";
import * as schema from "./schema/events";
export { schema };

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { AsyncResult, Result } from "typescript-result";
import { FileStorage, FSStorage } from "file-storage";
import Sqlite from "better-sqlite3";
import { tmpdir } from "os";
import upath from "upath";

const migrationsFolder = upath.join(process.cwd(), "drizzle");

export type Database = ReturnType<typeof drizzle<typeof schema>> & {
  sync(): AsyncResult<void, Error>;
};

function migrateDatabase<D extends BetterSQLite3Database<Record<string, unknown>>>(
  db: D
): Result<D, Error> {
  return Result.try(() => {
    migrate(db, { migrationsFolder });
    return db;
  });
}

export function getDatabase(
  storage: FileStorage,
  dbPath: string = "index.db"
): AsyncResult<Database, Error> {
  return storage
    .read(dbPath)
    .map(buf => new Sqlite(buf))
    .recover(() => new Sqlite(":memory:"))
    .map(client => drizzle(client, { schema }))
    .map(migrateDatabase)
    .map(db =>
      Object.assign(db, {
        sync: () => storage.write(dbPath, db.$client.serialize()),
      })
    );
}

const storage = new FSStorage(upath.join(tmpdir(), "foto-app"));
export const db = await getDatabase(storage).getOrThrow();
