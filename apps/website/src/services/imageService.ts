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

  getImages(eventId: string): AsyncResult<Image[], Error> {
    return Result.try(() =>
      this.dbService.db.select().from(imageTable).where(eq(imageTable.eventId, eventId))
    );
  }

  downloadImage(eventId: string, imageId: string): AsyncResult<Buffer, Error> {
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

  uploadImage(eventId: string, image: Blob): AsyncResult<Image, Error> {
    const id = uid.rnd();

    return Result.try(() => image.bytes())
      .mapCatching(buf => sharp(buf).webp().toBuffer())
      .map(image => this.storage.write(`${id}.webp`, image))
      .mapCatching(() =>
        this.dbService.db.insert(imageTable).values({ id, eventId }).returning()
      )
      .onSuccess(() => this.dbService.flush())
      .onFailure(() => this.storage.rm(`${id}.webp`).getOrThrow())
      .map(rows => getFirstRow(rows, "Unable to upload image"));
  }
}

export const imageService = new ImageService(dbService, storage);
