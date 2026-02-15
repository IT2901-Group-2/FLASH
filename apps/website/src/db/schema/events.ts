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

export const getEventSchema = z.object({
  id: z.string().array().min(1).optional(),
  name: z
    .tuple([z.string()])
    .transform(([str]) => str)
    .optional(),
  guestCode: z
    .tuple([z.string()])
    .transform(([str]) => str)
    .optional(),
  adminCode: z
    .tuple([z.string()])
    .transform(([str]) => str)
    .optional(),
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
export type GetEvent = z.infer<typeof getEventSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
