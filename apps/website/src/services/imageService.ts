import { JWT_SECRET, storage } from "@/config";
import { HTTPError } from "@/lib/utils/error";
import { getEventCookie } from "@/lib/utils/eventCookie";
import { makeGlobal } from "@/lib/utils/makeGlobal";
import { getFirstRow } from "@/lib/utils/sql";
import { FileStorage } from "@flash/file-storage";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { DatabaseService, dbService } from "./databaseService";
import { AsyncResult, Result } from "typescript-result";
import { eventTable, GetImagesParams, Image, imageTable, UpdateImage } from "@/db";
import sharp, { Sharp, SharpInput } from "sharp";
import ShortUniqueId from "short-unique-id";
import AdmZip from "adm-zip";

const uid = new ShortUniqueId();

export class ImageService {
  private readonly dbService: DatabaseService;
  private readonly storage: FileStorage;
  private readonly zipLocks = new Map<string, Promise<void>>();

  constructor(dbService: DatabaseService, storage: FileStorage) {
    this.dbService = dbService;
    this.storage = storage;
  }

  static readonly MAX_IMAGE_SIZE = 12 * 1024 * 1024;
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
   * Ensures that zip operations for a given event are executed serially.
   * If a zip operation is already in progress for the event, the new operation
   * will wait for it to complete before starting.
   * @param eventId The id of the event to lock the zip for.
   * @param fn The async function to execute within the lock.
   * @returns A promise that resolves when the funciton has completed.
   */

  private withZipLock(eventId: string, fn: () => Promise<void>): Promise<void> {
    const previous = this.zipLocks.get(eventId) ?? Promise.resolve();
    const next = previous.then(fn, fn);
    this.zipLocks.set(
      eventId,
      next.catch(() => {})
    );
    return next;
  }

  /**
   * Returns a list of all images associated with the specified event.
   *
   * @param eventId The id of the event.
   * @returns A result containing a list of `Image` objects or an error.
   */
  getImages(
    eventId: string,
    { id, approval }: GetImagesParams = {}
  ): AsyncResult<Image[], Error> {
    return Result.try(() =>
      this.dbService.db
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
    );
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

    return Result.genCatching(this, function* () {
      const { userId } = yield* getEventCookie(eventId, JWT_SECRET).mapError(
        () => new HTTPError(`User is not logged in to event with id: ${eventId}`, 403)
      );

      const { autoApprove, uploadLimit } = yield* Result.try(() =>
        this.dbService.db
          .select({
            autoApprove: eventTable.autoApprove,
            uploadLimit: eventTable.uploadLimit,
          })
          .from(eventTable)
          .where(eq(eventTable.id, eventId))
          .limit(1)
      ).map(rows => getFirstRow(rows, `Event with id ${eventId} does not exist`));

      const count = yield* this.getUploadedImageCountByUser(eventId, userId);

      if (uploadLimit !== null && count >= uploadLimit) {
        throw new HTTPError("Upload limit reached", 403);
      }

      const sharpImage = yield* this.validateImage(sharp(image)).map(sharpImage =>
        sharpImage.rotate().webp()
      );

      yield* Result.try(() => sharpImage.clone().toBuffer()).map(buff =>
        this.storage.write(`${imageId}.webp`, buff)
      );

      const previewImage = yield* Result.try(() =>
        sharpImage.clone().resize({ width: 32, height: 32 }).blur().toBuffer()
      ).map(buff => `data:image/webp;base64,${buff.toString("base64")}`);

      return Result.try(() =>
        this.dbService.db
          .insert(imageTable)
          .values({
            id: imageId,
            userId,
            eventId,
            previewImage,
            isApproved: autoApprove ? true : null,
          })
          .returning()
      )
        .map(rows => getFirstRow(rows, "Failed to upload image"))
        .onSuccess(async image => {
          this.dbService.flush();
          if (image.isApproved) {
            await this.addImageToZip(eventId, image.id).getOrThrow();
          }
        })
        .onFailure(async () => {
          await this.storage.rm(`${imageId}.webp`).getOrNull();
        });
    });
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
    )
      .onSuccess(() => this.dbService.flush())
      .onSuccess(async images => {
        if (data.isApproved !== undefined) {
          for (const image of images) {
            await (
              image.isApproved
                ? this.addImageToZip(eventId, image.id)
                : this.removeImageFromZip(eventId, image.id)
            ).getOrThrow();
          }
        }
      });
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
      .onSuccess(async () => {
        this.dbService.flush();
        if (data.isApproved !== undefined) {
          await (
            data.isApproved === true
              ? this.addImageToZip(eventId, imageId)
              : this.removeImageFromZip(eventId, imageId)
          ).getOrThrow();
        }
      });
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
      .onSuccess(async () => {
        this.dbService.flush();
        await this.removeImageFromZip(eventId, imageId).getOrThrow();
      })
      .map(row => this.storage.rm(`${row.id}.webp`).map(() => row));
  }

  /**
   * Downloads all images associated with the specified event as a zip archive.
   * Returns an empty zip if no archive (images) exists yet for the event.
   *
   * @param eventId The id of the event.
   * @returns A result containing the zip archive as a `Buffer` or an error.
   */
  downloadImages(eventId: string): AsyncResult<Buffer, Error> {
    return this.storage.read(`${eventId}.zip`).recover(() => {
      const zip = new AdmZip();
      return Result.ok(zip.toBuffer());
    });
  }

  /**
   * Adds a single image to the zip archive for the specified event.
   * Creates a new zip if one does not already exist.
   * Acquires the zip lock to ensure the operation is serialized with other zip operations
   * @param eventId The id of the event the image belongs to.
   * @param imageId The id of the image to add to the zip.
   * @returns A result containing void or an error.
   */
  private addImageToZip(eventId: string, imageId: string): AsyncResult<void, Error> {
    return Result.fromAsyncCatching(
      this.withZipLock(eventId, () =>
        this.storage
          .read(`${eventId}.zip`)
          .recover(() => Result.ok(undefined))
          .map(zip => new AdmZip(zip))
          .map(zip =>
            this.storage
              .read(`${imageId}.webp`)
              .map(buffer => zip.addFile(`${imageId}.webp`, buffer))
              .map(() => this.storage.write(`${eventId}.zip`, zip.toBuffer()))
          )
          .getOrThrow()
      )
    );
  }

  /**
   * Removes a single image from the zip archive for the specified event.
   * If no zip exists, this is a no-op.
   * Aquires the zip lock to ensure the operation is serialized with other zip operations.
   * @param eventId The id of the event the image belongs to.
   * @param imageId The id of the image to remove from the zip.
   * @returns A result containing void or an error.
   */
  private removeImageFromZip(eventId: string, imageId: string): AsyncResult<void, Error> {
    return Result.fromAsyncCatching(
      this.withZipLock(eventId, () =>
        this.storage
          .read(`${eventId}.zip`)
          .recover(() => Result.ok(undefined))
          .map(zip => new AdmZip(zip))
          .mapCatching(zip =>
            Result.try(() => zip.deleteFile(`${imageId}.webp`)).map(() =>
              this.storage.write(`${eventId}.zip`, zip.toBuffer())
            )
          )
          .getOrThrow()
      )
    );
  }

  /**
   * Returns the number of images uploaded by the specified user in the specified event.
   * @param eventId The id of the event.
   * @param userId The id of the user.
   * @returns A result containing the uploaded image count or an error.
   */
  private getUploadedImageCountByUser(
    eventId: string,
    userId: string
  ): AsyncResult<number, Error> {
    return Result.try(() =>
      this.dbService.db
        .select({ count: sql<number>`count(*)` })
        .from(imageTable)
        .where(and(eq(imageTable.eventId, eventId), eq(imageTable.userId, userId)))
    )
      .map(getFirstRow)
      .map(({ count }) => count);
  }

  /**
   * Returns the number of images uploaded by the currently authenticated user in the given event.
   *
   * @param eventId The id of the event.
   * @returns A result containing the uploaded image count or an error.
   */
  getUploadedImageCount(eventId: string): AsyncResult<number, Error> {
    return Result.genCatching(this, function* () {
      const { userId } = yield* getEventCookie(eventId, JWT_SECRET).mapError(
        () => new HTTPError(`User is not logged in to event with id: ${eventId}`, 403)
      );

      return yield* this.getUploadedImageCountByUser(eventId, userId);
    });
  }
}

export const imageService = makeGlobal(
  "imageService",
  () => new ImageService(dbService, storage)
);
