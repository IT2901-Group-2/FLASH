import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import ShortUniqueId from "short-unique-id";
import { eventTable } from "./events";

const uid = new ShortUniqueId();

export const imageTable = sqliteTable("images", {
  id: text().primaryKey().$defaultFn(uid.rnd),
  eventId: text()
    .notNull()
    .references(() => eventTable.id),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type Image = typeof imageTable.$inferSelect;
