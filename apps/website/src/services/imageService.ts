import { FileStorage } from "@flash/file-storage";
import { DatabaseService, dbService } from "./databaseService";
import { AsyncResult, Result } from "typescript-result";
import { eventTable, GetImagesParams, Image, imageTable, UpdateImage } from "@/db";
import sharp, { Sharp, SharpInput } from "sharp";
import ShortUniqueId from "short-unique-id";
import { getFirstRow } from "@/lib/utils/sql";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { JWT_SECRET, storage } from "@/config";
import { makeGlobal } from "@/lib/utils/makeGlobal";
import { getEventCookie } from "@/lib/utils/eventCookie";
import { HTTPError } from "@/lib/utils/error";
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
    next.then(() => {
      if (this.zipLocks.get(eventId) === next) {
        this.zipLocks.delete(eventId);
      }
    });
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
                .select()
                .from(eventTable)
                .where(eq(eventTable.id, eventId))
                .limit(1)
            )
              .map(rows => getFirstRow(rows, `Event with id ${eventId} does not exist`))
              .map(event =>
                Result.try(() =>
                  this.dbService.db
                    .insert(imageTable)
                    .values({
                      id: imageId,
                      userId,
                      eventId,
                      isApproved: event.autoApprove ? true : null,
                    })
                    .returning()
                )
                  .map(rows => getFirstRow(rows, "Failed to upload image"))
                  .mapCatching(async image => {
                    this.dbService.flush();
                    // Only add to zip if auto-approved
                    if (event.autoApprove) {
                      const result = await this.addImageToZip(eventId, image.id);
                      if (!result.ok) {
                        console.error(
                          `Failed to add image ${image.id} to zip for event ${eventId}:`,
                          result.error
                        );
                      }
                    }
                    return image;
                  })
                  .onFailure(async () => {
                    await this.storage.rm(`${imageId}.webp`).getOrNull();
                  })
              )
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
    )
      .onSuccess(() => this.dbService.flush())
      .mapCatching(async images => {
        if (data.isApproved !== undefined) {
          const result = await this.rebuildZip(eventId);
          if (!result.ok) {
            console.error(`Failed to rebuild zip for event ${eventId}:`, result.error);
          }
        }
        return images;
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
      .onSuccess(() => this.dbService.flush())
      .mapCatching(async image => {
        if (data.isApproved === true) {
          const result = await this.addImageToZip(eventId, imageId);
          if (!result.ok) {
            console.error(`Failed to add image ${imageId} to zip:`, result.error);
          }
        } else if (data.isApproved === false) {
          const result = await this.removeImageFromZip(eventId, imageId);
          if (!result.ok) {
            console.error(`Failed to remove image ${imageId} from zip:`, result.error);
          }
        }
        return image;
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
      .onSuccess(() => this.dbService.flush())
      .map(row => this.storage.rm(`${row.id}.webp`).map(() => row))
      .onSuccess(async image => {
        const result = await this.removeImageFromZip(eventId, image.id);
        if (!result.ok) {
          console.error(
            `Failed to remove image ${image.id} from zip for event ${eventId}:`,
            result.error
          );
        }
      });
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
   * Rebuilds the zip archive for the specified event from scratch.
   * Fetches all images associated with the event and repacks them into a new zip.
   * Aquires the zip lock to ensure no concurrent zip operations run during the rebuild.
   * @param eventId The id of the event to rebuild the zip for.
   * @returns A result containing void or an error.
   */
  rebuildZip(eventId: string): AsyncResult<void, Error> {
    return Result.fromAsyncCatching(
      this.withZipLock(eventId, async () => {
        const images = await this.getImages(eventId, {
          approval: "approved",
        }).getOrThrow();
        const zip = new AdmZip();
        for (const image of images) {
          const buffer = await this.storage.read(`${image.id}.webp`).getOrThrow();
          zip.addFile(`${image.id}.webp`, buffer);
        }
        await this.storage.write(`${eventId}.zip`, zip.toBuffer()).getOrThrow();
      })
    );
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
      this.withZipLock(eventId, async () => {
        const existing = await this.storage.read(`${eventId}.zip`).getOrNull();
        const zip = new AdmZip(existing ?? undefined);

        const buffer = await this.storage.read(`${imageId}.webp`).getOrThrow();

        zip.addFile(`${imageId}.webp`, buffer);

        await this.storage.write(`${eventId}.zip`, zip.toBuffer()).getOrThrow();
      })
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
      this.withZipLock(eventId, async () => {
        const existing = await this.storage.read(`${eventId}.zip`).getOrNull();
        const zip = new AdmZip(existing ?? undefined);
        zip.deleteFile(`${imageId}.webp`);
        await this.storage.write(`${eventId}.zip`, zip.toBuffer()).getOrThrow();
      })
    );
  }
}

export const imageService = makeGlobal(
  "imageService",
  () => new ImageService(dbService, storage)
);
