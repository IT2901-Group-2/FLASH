import { integer, sqliteTable, text, check } from "drizzle-orm/sqlite-core";
import ShortUniqueId from "short-unique-id";
import { lte } from "drizzle-orm";
import { z } from "zod";

const uid = new ShortUniqueId();
const code = new ShortUniqueId({ length: 6, dictionary: "alphanum_upper" });

export const eventTable = sqliteTable(
  "events",
  {
    id: text().primaryKey().$defaultFn(uid.rnd),
    name: text().notNull(),
    description: text().notNull().default(""),
    startDate: integer({ mode: "timestamp" }).notNull(),
    endDate: integer({ mode: "timestamp" }).notNull(),
    uploadLimit: integer(),
    guestCode: text().unique().notNull().$defaultFn(code.rnd),
    moderatorCode: text().unique().notNull().$defaultFn(code.rnd),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
    isArchived: integer({ mode: "boolean" }).default(false),
  },
  t => [check("dateConstraint", lte(t.startDate, t.endDate))]
);

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
  moderatorCode: z
    .tuple([z.string()])
    .transform(([str]) => str)
    .optional(),
  type: z
    .tuple([z.enum(["coming", "active", "finished"])])
    .transform(([str]) => str)
    .optional(),
  archived: z
    .tuple([z.boolean()])
    .transform(([bool]) => bool)
    .default(false),
});

export const createEventSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  uploadLimit: z.number().positive().optional(),
});

export const updateEventSchema = z.object({
  name: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  uploadLimit: z.number().optional(),
});

export type Event = typeof eventTable.$inferSelect;
export type GetEvent = z.infer<typeof getEventSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
