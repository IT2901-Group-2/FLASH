import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { AsyncResult } from "typescript-result";
import { FileStorage } from "file-storage";
import Sqlite from "better-sqlite3";
import upath from "upath";

import * as schema from "./schema";
export default schema;
export * from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

const migrationsFolder = upath.join(process.cwd(), "drizzle");
const DBFILE = "index.db" as const;

export function getDatabase(storage: FileStorage): AsyncResult<Database, Error> {
  return storage
    .read(DBFILE)
    .map(buf => new Sqlite(buf))
    .recover(() => new Sqlite(":memory:"))
    .map(client => drizzle(client, { schema }))
    .mapCatching(db => migrate(db, { migrationsFolder }));
}

export function backupDatabase(
  storage: FileStorage,
  db: Database
): AsyncResult<void, Error> {
  return storage.write(DBFILE, db.$client.serialize());
}
