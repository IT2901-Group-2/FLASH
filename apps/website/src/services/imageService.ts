import { JWT_SECRET, MAX_IMAGE_SIZE } from "@/config";
import { HTTPError } from "@/lib/utils/error";
import { getEventCookie } from "@/lib/utils/eventCookie";
import { makeGlobal } from "@/lib/utils/makeGlobal";
import { getFirstRow } from "@/lib/utils/sql";
import { FileStorage } from "@flash/file-storage";
import { and, asc, eq, inArray, isNull, SQL, sql } from "drizzle-orm";
import { DatabaseService, dbService } from "./databaseService";
import { AsyncResult, Result } from "typescript-result";
import {
  eventTable,
  GetImagesPage,
  GetImageParams,
  GetImagesParams,
  Image,
  imageSizesTable,
  imageTable,
  UpdateImage,
  GetMyImagesParams,
} from "@/db";
import sharp, { Sharp, SharpInput } from "sharp";
import ShortUniqueId from "short-unique-id";
import AdmZip from "adm-zip";
import { verifyAccessToken } from "@/lib/utils/auth";
import { eventService } from "./eventService";
import { storage } from "@/config/storage";

const uid = new ShortUniqueId();

export class ImageService {
  private readonly dbService: DatabaseService;
  private readonly storage: FileStorage;
  private readonly zipLocks = new Map<string, Promise<void>>();

  constructor(dbService: DatabaseService, storage: FileStorage) {
    this.dbService = dbService;
    this.storage = storage;
  }

  static readonly TARGET_IMAGE_SIZES: number[] = [250];

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

      if (meta.size > MAX_IMAGE_SIZE) {
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
    { id, approval, cursor, pageSize = 20 }: GetImagesParams = {}
  ): AsyncResult<GetImagesPage, Error> {
    const offset = cursor ?? 0;

    return this.getVisibleToUserId(eventId)
      .mapCatching(visibleToUserId =>
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
              approval === "pending" ? isNull(imageTable.isApproved) : undefined,
              visibleToUserId !== undefined
                ? eq(imageTable.userId, visibleToUserId)
                : undefined
            )
          )
          .orderBy(imageTable.createdAt)
          .offset(offset)
          .limit(pageSize + 1)
      )
      .map(rows => ({
        items: rows.slice(0, pageSize),
        nextCursor: rows.length > pageSize ? offset + pageSize : null,
      }));
  }

  /**
   * Returns the "ORDER BY" clause to use in order to get the desired image size.
   *
   * @param param The desired width and height of the image.
   * @returns An SQL statement to use in an "ORDER BY" clause.
   */
  private getSizeOrder({ width, height }: GetImageParams): SQL | null {
    if (width !== undefined && height !== undefined) {
      return asc(
        sql`abs(${imageSizesTable.width} * ${imageSizesTable.height} - ${width * height})`
      );
    }

    if (width !== undefined) {
      return asc(sql`abs(${imageSizesTable.width} - ${width})`);
    }

    if (height !== undefined) {
      return asc(sql`abs(${imageSizesTable.height} - ${height})`);
    }

    return null;
  }

  /**
   * Downloads the image with the specified id.
   * Will fail if the image does not exist or does not belong to the specified event.
   *
   * @param eventId The id of the event the image belongs to.
   * @param imageId The id of the image to download.
   * @param params The desired width and height of the image.
   * @returns A result containing the downloaded image as a `Buffer` or an error
   */
  downloadImage(
    eventId: string,
    imageId: string,
    params: GetImageParams = {}
  ): AsyncResult<Buffer<ArrayBufferLike>, Error> {
    return Result.gen(this, function* () {
      yield* this.getVisibleToUserId(eventId)
        .mapCatching(visibleToUserId =>
          this.dbService.db
            .select()
            .from(imageTable)
            .where(
              and(
                eq(imageTable.eventId, eventId),
                eq(imageTable.id, imageId),
                visibleToUserId !== undefined
                  ? eq(imageTable.userId, visibleToUserId)
                  : undefined
              )
            )
            .limit(1)
        )
        .map(rows =>
          getFirstRow(
            rows,
            `Image with id ${imageId} does not exist on event with id ${eventId}`
          )
        );

      const sortOrder = this.getSizeOrder(params);
      if (sortOrder === null) {
        return this.storage.read(`${imageId}.webp`);
      }

      return Result.try(() =>
        this.dbService.db
          .select()
          .from(imageSizesTable)
          .where(eq(imageSizesTable.imageId, imageId))
          .orderBy(sortOrder)
          .limit(1)
      ).map(([row]) =>
        this.storage.read(
          row === undefined
            ? `${imageId}.webp`
            : `${imageId}-${row.width}x${row.height}.webp`
        )
      );
    });
  }

  /**
   * Attempts to resize and save the image in all the desired image sizes.
   * The image will never be enlarged.
   *
   * @param imageId The id of the image to save.
   * @param sharpImage The image to save loaded into a `sharp` pipeline.
   * @returns A result containing the actual sizes the image was saved as or an error.
   */
  private saveImage(
    imageId: string,
    sharpImage: Sharp
  ): AsyncResult<[number, number][], Error> {
    return Result.try(() => sharpImage.clone().toBuffer())
      .map(buff => this.storage.write(`${imageId}.webp`, buff))
      .map(() => sharpImage.metadata())
      .map(({ width, height }) =>
        Result.all(
          ...ImageService.TARGET_IMAGE_SIZES.filter(s => s < Math.max(width, height)).map(
            s =>
              Result.try(() =>
                sharpImage
                  .clone()
                  .resize(s, s, { fit: "inside" })
                  .toBuffer({ resolveWithObject: true })
              ).map(({ data, info: { width, height } }) =>
                this.storage
                  .write(`${imageId}-${width}x${height}.webp`, data)
                  .map(() => [width, height])
              )
          )
        )
      );
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

      const { autoApprove, uploadLimit, endDate } = yield* Result.try(() =>
        this.dbService.db
          .select({
            autoApprove: eventTable.autoApprove,
            uploadLimit: eventTable.uploadLimit,
            endDate: eventTable.endDate,
          })
          .from(eventTable)
          .where(eq(eventTable.id, eventId))
          .limit(1)
      ).map(rows => getFirstRow(rows, `Event with id ${eventId} does not exist`));

      if (new Date() > endDate) {
        throw new HTTPError("Event has ended, uploads are closed", 403);
      }

      const count = yield* this.getUploadedImageCountByUser(eventId, userId);

      if (uploadLimit !== null && count >= uploadLimit) {
        throw new HTTPError("Upload limit reached", 403);
      }

      const sharpImage = yield* this.validateImage(sharp(image)).map(sharpImage =>
        sharpImage.rotate().webp()
      );

      const imageSizes = yield* this.saveImage(imageId, sharpImage);

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
        .map(rows =>
          getFirstRow(rows, "Failed to upload image").map(image =>
            imageSizes.length > 0
              ? Result.try(() =>
                  this.dbService.db
                    .insert(imageSizesTable)
                    .values(
                      imageSizes.map(([width, height]) => ({ imageId, width, height }))
                    )
                    .returning()
                ).map(rows => getFirstRow(rows).map(() => image))
              : image
          )
        )
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
    return Result.genCatching(this, function* () {
      const isAdmin = yield* Result.fromAsyncCatching(
        verifyAccessToken()
          .then(() => true)
          .catch(() => false)
      );

      const { endDate } = yield* Result.try(() =>
        this.dbService.db
          .select({ endDate: eventTable.endDate })
          .from(eventTable)
          .where(eq(eventTable.id, eventId))
          .limit(1)
      ).map(rows => getFirstRow(rows, `Event with id ${eventId} does not exist`));

      if (new Date() < endDate && !isAdmin) {
        throw new HTTPError("Event is still live, downloads are not yet available", 403);
      }

      return this.storage.read(`${eventId}.zip`).recover(() => {
        const zip = new AdmZip();
        return Result.ok(zip.toBuffer());
      });
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
   * Retrieves the authenticated user's ID from the event cookie.
   * @param eventId The id of the event.
   * @returns A result containing the user ID, or a 403 error if the user is not logged in.
   */
  private getAuthenticatedUserId(eventId: string): AsyncResult<string, Error> {
    return getEventCookie(eventId, JWT_SECRET)
      .mapError(
        () => new HTTPError(`User is not logged in to event with id: ${eventId}`, 403)
      )
      .map(({ userId }) => userId);
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
   * Returns all images uploaded by the currently authenticated user in the given event,
   * regardless of approval status.
   *
   * @param eventId The id of the event.
   * @returns A result containing the list of `Image` objects or an error.
   */
  getImagesByUser(
    eventId: string,
    { cursor = 0, pageSize = 20 }: GetMyImagesParams = {}
  ): AsyncResult<GetImagesPage, Error> {
    return this.getAuthenticatedUserId(eventId)
      .mapCatching(userId =>
        this.dbService.db
          .select()
          .from(imageTable)
          .where(and(eq(imageTable.eventId, eventId), eq(imageTable.userId, userId)))
          .offset(cursor)
          .limit(pageSize + 1)
      )
      .map(rows => ({
        items: rows.slice(0, pageSize),
        nextCursor: rows.length > pageSize ? cursor + pageSize : null,
      }));
  }

  /**
   * Returns the number of images uploaded by the currently authenticated user in the given event.
   *
   * @param eventId The id of the event.
   * @returns A result containing the uploaded image count or an error.
   */
  getUploadedImageCount(eventId: string): AsyncResult<number, Error> {
    return Result.genCatching(this, function* () {
      const userId = yield* this.getAuthenticatedUserId(eventId);

      return yield* this.getUploadedImageCountByUser(eventId, userId);
    });
  }
  /**
   * Returns the userId to filter images by based on whether the event's uploads
   * are private and whether the requesting user has elevated privileges.
   * Returns `undefined` if all images are visible (i.e. public or privileged user).
   */

  private getVisibleToUserId(eventId: string): AsyncResult<string | undefined, Error> {
    return Result.genCatching(this, async function* () {
      const { userId, isModerator } = yield* getEventCookie(eventId, JWT_SECRET);
      const isAdmin = await verifyAccessToken()
        .then(() => true)
        .catch(() => false);
      if (isAdmin || isModerator) {
        return undefined;
      }
      const {
        items: [event],
      } = yield* eventService.getEvents({ id: [eventId] });
      return event?.uploadsArePrivate === true ? userId : undefined;
    });
  }
}

export const imageService = makeGlobal(
  "imageService",
  () => new ImageService(dbService, storage)
);
