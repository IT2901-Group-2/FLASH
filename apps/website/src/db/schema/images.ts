import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import ShortUniqueId from "short-unique-id";
import { eventTable } from "./events";
import z from "zod";
import { userTable } from "./users";

const uid = new ShortUniqueId();

export const imageTable = sqliteTable("images", {
  id: text().primaryKey().$defaultFn(uid.rnd),
  eventId: text()
    .notNull()
    .references(() => eventTable.id),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  isApproved: integer({ mode: "boolean" }),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const getImagesSchema = z.object({
  id: z.string().array().min(1).optional(),
  approval: z
    .tuple([z.enum(["pending", "approved", "rejected"])])
    .transform(([str]) => str)
    .optional(),
});

export const updateImageSchema = z.object({
  isApproved: z.boolean().nullable().optional(),
});

export type Image = typeof imageTable.$inferSelect;
export type GetImages = z.infer<typeof getImagesSchema>;
export type UpdateImage = z.infer<typeof updateImageSchema>;
