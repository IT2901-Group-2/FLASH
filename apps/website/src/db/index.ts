export * from "./schema";

import * as schema from "./schema/events";
export { schema };

import upath from "upath";
import { Result } from "typescript-result";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate as drizzleMigrate } from "drizzle-orm/better-sqlite3/migrator";

const migrationsFolder = upath.join(process.cwd(), "drizzle");

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export function migrate(db: Database): Result<Database, Error> {
  return Result.try(() => drizzleMigrate(db, { migrationsFolder })).map(() => db);
}
