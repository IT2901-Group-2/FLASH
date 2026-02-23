import { FileStorage } from "file-storage";
import { DatabaseService, dbService } from "./databaseService";
import { AsyncResult, Result } from "typescript-result";
import { Image, imageTable } from "@/db";
import sharp from "sharp";
import ShortUniqueId from "short-unique-id";
import { getFirstRow } from "@/lib/utils/sql";
import { and, eq } from "drizzle-orm";
import { storage } from "@/config";

const uid = new ShortUniqueId();

export class ImageService {
  private readonly dbService: DatabaseService;
  private readonly storage: FileStorage;

  constructor(dbService: DatabaseService, storage: FileStorage) {
    this.dbService = dbService;
    this.storage = storage;
  }

  /**
   * Attempts to convert the blob into a wepb image.
   *
   * @param image The blob to convert.
   * @returns A result contianing a webp image as a buffer or an error.
   */
  private convertImage(image: Blob): AsyncResult<Buffer<ArrayBufferLike>, Error> {
    return Result.try(() => image.bytes()).mapCatching(buf =>
      sharp(buf).webp().toBuffer()
    );
  }

  /**
   * Returns a list of all images associated with the specified event.
   *
   * @param eventId The id of the event.
   * @returns A result containing a list of `Image` objects or an error.
   */
  getImages(eventId: string): AsyncResult<Image[], Error> {
    return Result.try(() =>
      this.dbService.db.select().from(imageTable).where(eq(imageTable.eventId, eventId))
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
  uploadImage(eventId: string, image: Blob): AsyncResult<Image, Error> {
    const id = uid.rnd();

    return this.convertImage(image)
      .map(image => this.storage.write(`${id}.webp`, image))
      .map(() =>
        Result.try(() =>
          this.dbService.db.insert(imageTable).values({ id, eventId }).returning()
        )
          .map(rows => getFirstRow(rows, "Unable to upload image"))
          .onFailure(() => this.storage.rm(`${id}.webp`).getOrThrow())
          .onSuccess(() => this.dbService.flush())
      );
  }
}

export const imageService = new ImageService(dbService, storage);
