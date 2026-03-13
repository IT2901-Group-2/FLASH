import { integer, sqliteTable, text, check, unique } from "drizzle-orm/sqlite-core";
import ShortUniqueId from "short-unique-id";
import { lte } from "drizzle-orm";
import { z } from "zod";
import { assertEqual } from "@/lib/utils/assert";

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
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
    isArchived: integer({ mode: "boolean" }).notNull().default(false),
  },
  t => [check("dateConstraint", lte(t.startDate, t.endDate))]
);

export const eventCodeTable = sqliteTable(
  "eventCodes",
  {
    code: text().primaryKey().$defaultFn(code.rnd),
    eventId: text()
      .notNull()
      .references(() => eventTable.id, { onDelete: "cascade" }),
    isModerator: integer({ mode: "boolean" }).notNull(),
  },
  t => [unique("codeConstraint").on(t.code, t.eventId, t.isModerator)]
);

export const getEventsParamsSchema = z.object({
  id: z.string().array().min(1).optional(),
  name: z
    .tuple([z.string()])
    .transform(([str]) => str)
    .optional(),
  status: z
    .tuple([z.enum(["upcoming", "active", "finished"])])
    .transform(([str]) => str)
    .optional(),
  archived: z
    .tuple([z.enum(["true", "false", "all"])])
    .transform(([str]) => (str === "all" ? undefined : str === "true"))
    .prefault(["false"])
    .optional(),
  sortBy: z
    .tuple([
      z.enum([
        "name",
        "description",
        "startDate",
        "endDate",
        "uploadLimit",
        "createdAt",
        "updatedAt",
      ]),
    ])
    .transform(([str]) => str)
    .optional(),
  order: z
    .tuple([z.enum(["ascending", "descending"])])
    .transform(([str]) => str)
    .prefault(["ascending"])
    .optional(),
});

export const getEventCodeParamsSchema = z.object({
  role: z
    .tuple([z.enum(["guest", "moderator"])])
    .transform(([str]) => str)
    .prefault(["guest"]),
});

export const getEventCodeSchema = z.object({
  eventId: z.string(),
  code: z.string(),
  isModerator: z.boolean(),
});

export const getEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  uploadLimit: z.number().positive().nullable(),
  isArchived: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
void assertEqual<Event, z.infer<typeof getEventSchema>>;

export const createEventSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  uploadLimit: z.number().positive().optional(),
  isArchived: z.boolean().optional(),
});

export const updateEventSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  uploadLimit: z.number().optional(),
  isArchived: z.boolean().optional(),
});

export type Event = typeof eventTable.$inferSelect;
export type EventCode = typeof eventCodeTable.$inferSelect;
export type GetEventsParams = z.infer<typeof getEventsParamsSchema>;
export type GetEventCodeParams = z.infer<typeof getEventCodeParamsSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
