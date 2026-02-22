import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
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

export const imageSizeTable = sqliteTable(
  "imageSizes",
  {
    id: text()
      .notNull()
      .references(() => imageTable.id),
    width: integer().notNull(),
    height: integer().notNull(),
    original: integer({ mode: "boolean" }).notNull().default(false),
  },
  t => [primaryKey({ columns: [t.id, t.width, t.height] })]
);

export type Image = typeof imageTable.$inferSelect;
export type ImageSize = typeof imageSizeTable.$inferSelect;

export type ImageWithSizes = Image & { sizes: [number, number][] };
