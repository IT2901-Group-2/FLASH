import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import ShortUniqueId from "short-unique-id";
import { eventTable } from "./events";
import z from "zod";
import { userTable } from "./users";
import { assertEqual } from "@/lib/utils/assert";
import { BATCH_IMAGE_LIMIT } from "@/config/images";

const uid = new ShortUniqueId();

export const imageTable = sqliteTable("images", {
  id: text().primaryKey().$defaultFn(uid.rnd),
  eventId: text()
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade" }),
  userId: text()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  isApproved: integer({ mode: "boolean" }),
  previewImage: text().notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const getImagesParamsSchema = z.object({
  id: z.string().array().min(1).optional(),
  approval: z
    .tuple([z.enum(["pending", "approved", "rejected"])])
    .transform(([str]) => str)
    .optional(),
});

export const getImageSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  isApproved: z.boolean().nullable(),
  previewImage: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
void assertEqual<Image, z.infer<typeof getImageSchema>>;

export const updateImageSchema = z.object({
  isApproved: z.boolean().nullable().optional(),
});

export const updateImagesSchema = z.object({
  ids: z.string().array().min(1).max(BATCH_IMAGE_LIMIT),
  isApproved: z.boolean(),
});

export type Image = typeof imageTable.$inferSelect;
export type GetImagesParams = z.infer<typeof getImagesParamsSchema>;
export type UpdateImage = z.infer<typeof updateImageSchema>;
export type UpdateImages = z.infer<typeof updateImagesSchema>;
