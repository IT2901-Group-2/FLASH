import { DatabaseService, dbService } from "./databaseService";
import { Image, ImageSize, imageSizeTable, imageTable, ImageWithSizes } from "@/db";
import { AsyncResult, Result } from "typescript-result";
import { getFirstRow } from "@/lib/utils/sql";
import { FileStorage } from "file-storage";
import { and, eq } from "drizzle-orm";
import { storage } from "@/config";
import sharp, { Sharp, SharpInput } from "sharp";

export class ImageService {
  private readonly dbService: DatabaseService;
  private readonly storage: FileStorage;

  private static readonly MAX_IMAGE_SIZE = 4 * 1024 * 1024;
  private static readonly IMAGE_TARGET_SIZES: [number, number][] = [
    [200, 200],
    [500, 500],
    [1500, 1500],
  ];

  constructor(dbService: DatabaseService, storage: FileStorage) {
    this.dbService = dbService;
    this.storage = storage;
  }

  private validateImage(sharpImage: Sharp): AsyncResult<[number, number], Error> {
    return Result.fromAsyncCatching(sharpImage.clone().metadata()).map(meta => {
      if (meta.size === undefined) {
        return Result.error(new Error("Unable to determine image size"));
      }

      if (meta.size > ImageService.MAX_IMAGE_SIZE) {
        return Result.error(new Error("Image exceeded the max image size"));
      }

      return Result.ok([meta.width, meta.height]);
    });
  }

  private insertImage(
    sharpImage: Sharp,
    id: string,
    width: number,
    height: number,
    original: boolean = false
  ): AsyncResult<ImageSize, Error> {
    const filename = `${id}-${width}x${height}.webp`;

    return Result.try(() => sharpImage.clone().webp().toBuffer())
      .mapCatching(buff => this.storage.write(filename, buff))
      .mapCatching(() =>
        this.dbService.db
          .insert(imageSizeTable)
          .values({ id, width, height, original })
          .returning()
      )
      .map(rows => getFirstRow(rows, "Failed to insert image size"))
      .onFailure(async () => {
        await this.storage.rm(filename).getOrNull();
      });
  }

  uploadImage(eventId: string, image: SharpInput): AsyncResult<ImageWithSizes, Error> {
    return Result.genCatching(this, async function* () {
      const sharpImage = sharp(image);
      const [width, height] = yield* this.validateImage(sharpImage);

      const imageRow = yield* Result.try(() =>
        this.dbService.db.insert(imageTable).values({ eventId }).returning()
      ).map(rows => getFirstRow(rows, "Failed to insert image"));

      const imageResizeOptions: { width: number; height: number; original: boolean }[] = [
        { width, height, original: true },
        ...ImageService.IMAGE_TARGET_SIZES.filter(
          ([w, h]) => w <= width && h <= height
        ).map(([width, height]) => ({ width, height, original: false })),
      ];

      const imageSizeRows = yield* Result.all(
        ...imageResizeOptions.map(opt =>
          this.insertImage(sharpImage, imageRow.id, opt.width, opt.height, opt.original)
        )
      );

      this.dbService.flush();
      return {
        ...imageRow,
        sizes: imageSizeRows.map(row => [row.width, row.height] as [number, number]),
      };
    });
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
}

export const imageService = new ImageService(dbService, storage);
