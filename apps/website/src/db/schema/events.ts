import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";
import { z } from "zod";

export const eventTable = sqliteTable("events", {
  id: text().primaryKey().$defaultFn(ulid),
  name: text().notNull(),
  uploadLimit: integer(),
  guestCode: text().unique().notNull().$defaultFn(ulid),
  adminCode: text().unique().notNull().$defaultFn(ulid),
});

export const createEventSchema = z.object({
  name: z.string(),
  uploadLimit: z.number().positive().optional(),
});

export const updateEventSchema = z.object({
  name: z.string().optional(),
  uploadLimit: z.number().optional(),
});

export type Event = typeof eventTable.$inferSelect;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
