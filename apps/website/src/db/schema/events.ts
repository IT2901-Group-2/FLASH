import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const eventTable = sqliteTable("events", {
  id: integer().primaryKey(),
  name: text().notNull(),
  uploadLimit: integer(),
  guestCode: text().unique().notNull().$defaultFn(ulid),
  adminCode: text().unique().notNull().$defaultFn(ulid),
});

export type SelectEvent = typeof eventTable.$inferSelect;
export type InsertEvent = typeof eventTable.$inferInsert;

export type Event = SelectEvent;
export type CreateEvent = Omit<InsertEvent, "id" | "guestCode" | "adminCode">;
