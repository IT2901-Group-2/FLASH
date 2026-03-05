import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import ShortUniqueId from "short-unique-id";
import { eventTable } from "./events";
import z from "zod";

const uid = new ShortUniqueId({ length: 12 });

export const userTable = sqliteTable(
  "users",
  {
    id: text().primaryKey().$defaultFn(uid.rnd),
    eventId: text()
      .notNull()
      .references(() => eventTable.id),
    name: text().notNull(),
    isModerator: integer({ mode: "boolean" }).notNull(),
    joinedAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    lastAccessedAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  t => [unique("name").on(t.eventId, t.name)]
);

export const createUserSchema = z.object({
  eventCode: z.tuple([z.string()]).transform(([str]) => str),
  name: z.tuple([z.string()]).transform(([str]) => str),
});

export const eventCookieSchema = z.object({
  userId: z.string(),
  name: z.string(),
  isModerator: z.boolean(),
});

export type User = typeof userTable.$inferSelect;
export type CreateUser = z.infer<typeof createUserSchema>;
export type EventCookie = z.infer<typeof eventCookieSchema>;
