import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const testTable = sqliteTable("test_table", {
  id: integer().primaryKey(),
  val: text().notNull(),
});
