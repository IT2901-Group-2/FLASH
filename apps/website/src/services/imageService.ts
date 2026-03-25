import { FileStorage } from "@flash/file-storage";
import { DatabaseService, dbService } from "./databaseService";
import { AsyncResult, Result } from "typescript-result";
import { GetImagesPage, GetImagesParams, Image, imageTable, UpdateImage } from "@/db";
import sharp, { Sharp, SharpInput } from "sharp";
import ShortUniqueId from "short-unique-id";
import { getFirstRow } from "@/lib/utils/sql";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { JWT_SECRET, storage } from "@/config";
import { makeGlobal } from "@/lib/utils/makeGlobal";
import { getEventCookie } from "@/lib/utils/eventCookie";
import { HTTPError } from "@/lib/utils/error";

const uid = new ShortUniqueId();

export class ImageService {
  private readonly dbService: DatabaseService;
  private readonly storage: FileStorage;

  constructor(dbService: DatabaseService, storage: FileStorage) {
    this.dbService = dbService;
    this.storage = storage;
  }

  static readonly MAX_IMAGE_SIZE = 8 * 1024 * 1024;
  /**
   * Validates the image metadata using `sharp`.
   * Checks that `sharp` is able to open the image file and that the size of the image does not exceed `ImageService.MAX_IMAGE_SIZE`.
   *
   * @param sharpImage `sharp` image to validate
   * @returns A result with the provided `sharp` image for chaining or an error if the image is invalid.
   */
  private validateImage(sharpImage: Sharp): AsyncResult<Sharp, Error> {
    return Result.fromAsyncCatching(sharpImage.clone().metadata()).map(meta => {
      if (meta.size === undefined) {
        return Result.error(new Error("Unable to determine image size"));
      }

      if (meta.size > ImageService.MAX_IMAGE_SIZE) {
        return Result.error(new Error("Image exceeded the max image size"));
      }

      return Result.ok(sharpImage);
    });
  }

  /**
   * Returns a list of all images associated with the specified event.
   *
   * @param eventId The id of the event.
   * @returns A result containing a list of `Image` objects or an error.
   */
  getImages(
    eventId: string,
    { id, approval, cursor, pageSize = 20 }: GetImagesParams = {}
  ): AsyncResult<GetImagesPage, Error> {
    const offset =
      cursor !== undefined && Number.isFinite(Number.parseInt(cursor, 10))
        ? Math.max(0, Number.parseInt(cursor, 10))
        : 0;

    return Result.try(async () => {
      const rows = await this.dbService.db
        .select()
        .from(imageTable)
        .where(
          and(
            eq(imageTable.eventId, eventId),
            id !== undefined ? inArray(imageTable.id, id) : undefined,
            approval !== undefined && approval !== "pending"
              ? eq(imageTable.isApproved, approval === "approved")
              : undefined,
            approval === "pending" ? isNull(imageTable.isApproved) : undefined
          )
        )
        .orderBy(desc(imageTable.createdAt), desc(imageTable.id))
        .offset(offset)
        .limit(pageSize + 1);

      const hasMore = rows.length > pageSize;
      const items = hasMore ? rows.slice(0, pageSize) : rows;

      return {
        items,
        nextCursor: hasMore ? String(offset + pageSize) : null,
      };
    });
  }

  /**
   * Downloads the image with the specified id.
   * Will fail if the image does not exist or does not belong to the specified event.
   *
   * @param eventId The id of the event the image belongs to.
   * @param imageId The id of the image to download.
   * @returns A result containing the downloaded image as a `Buffer` or an error
   */
  downloadImage(
    eventId: string,
    imageId: string
  ): AsyncResult<Buffer<ArrayBufferLike>, Error> {
    return Result.try(() =>
      this.dbService.db
        .select()
        .from(imageTable)
        .where(and(eq(imageTable.eventId, eventId), eq(imageTable.id, imageId)))
        .limit(1)
    )
      .map(rows =>
        getFirstRow(
          rows,
          `Image with id ${imageId} does not exist on event with id ${eventId}`
        )
      )
      .map(() => this.storage.read(`${imageId}.webp`));
  }

  /**
   * Uploads the given image blob to the specified event.
   *
   * @param eventId The id of the event to upload the image into.
   * @param image The image to upload.
   * @returns A result containing the newly inserted `Image` object or an error.
   */
  uploadImage(eventId: string, image: SharpInput): AsyncResult<Image, Error> {
    const imageId = uid.rnd();

    return getEventCookie(eventId, JWT_SECRET)
      .mapError(
        () => new HTTPError(`User is not logged in to event with id: ${eventId}`, 403)
      )
      .map(({ userId }) =>
        Result.try(() => sharp(image))
          .map(sharpImage => this.validateImage(sharpImage))
          .mapCatching(sharpImage => sharpImage.clone().rotate().webp().toBuffer())
          .map(buff => this.storage.write(`${imageId}.webp`, buff))
          .map(() =>
            Result.try(() =>
              this.dbService.db
                .insert(imageTable)
                .values({ id: imageId, userId, eventId })
                .returning()
            )
              .map(rows => getFirstRow(rows, "Failed to upload image"))
              .onSuccess(() => this.dbService.flush())
              .onFailure(async () => {
                await this.storage.rm(`${imageId}.webp`).getOrNull();
              })
          )
      );
  }

  /**
   * Updates multiple images in a single query.
   * IDs not belonging to the event are silently ignored.
   *
   * @param eventId The id of the event the images belong to.
   * @param ids The ids of the images to update.
   * @param data The data to update the images with.
   * @returns A result containing the updated `Image` objects or an error.
   */
  updateImages(
    eventId: string,
    ids: string[],
    data: UpdateImage
  ): AsyncResult<Image[], Error> {
    return Result.try(() =>
      this.dbService.db
        .update(imageTable)
        .set(data)
        .where(and(eq(imageTable.eventId, eventId), inArray(imageTable.id, ids)))
        .returning()
    ).onSuccess(() => this.dbService.flush());
  }

  /**
   * Updates the image with the specified id.
   * Will fail if the image does not exist or does not belong to the specified event.
   *
   * @param eventId The id of the event the image belongs to.
   * @param imageId The id of the image to update.
   * @param data The data to update the image with.
   * @returns A result containing the updated `Ìmage` object or an error
   */
  updateImage(
    eventId: string,
    imageId: string,
    data: UpdateImage
  ): AsyncResult<Image, Error> {
    return Result.try(() =>
      this.dbService.db
        .update(imageTable)
        .set(data)
        .where(and(eq(imageTable.eventId, eventId), eq(imageTable.id, imageId)))
        .returning()
    )
      .map(rows =>
        getFirstRow(
          rows,
          `Image with id ${imageId} does not exist on event with id ${eventId}`
        )
      )
      .onSuccess(() => this.dbService.flush());
  }

  /**
   * Deletes the image with the specified id.
   * Will fail if the image does not exist or does not belong to the specified event.
   *
   * @param eventId The id of the event the image belongs to.
   * @param imageId The id of the image to delete.
   * @returns A result containing the deleted `Ìmage` object or an error
   */
  deleteImage(eventId: string, imageId: string): AsyncResult<Image, Error> {
    return Result.try(() =>
      this.dbService.db
        .delete(imageTable)
        .where(and(eq(imageTable.eventId, eventId), eq(imageTable.id, imageId)))
        .returning()
    )
      .map(rows =>
        getFirstRow(
          rows,
          `Image with id ${imageId} does not exist on event with id ${eventId}`
        )
      )
      .onSuccess(() => this.dbService.flush())
      .map(row => this.storage.rm(`${row.id}.webp`).map(() => row));
  }
}

export const imageService = makeGlobal(
  "imageService",
  () => new ImageService(dbService, storage)
);
