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
  name: z.string(),
  role: z.enum(["guest", "moderator"]),
});

export type CreateUser = z.infer<typeof createUserSchema>;
