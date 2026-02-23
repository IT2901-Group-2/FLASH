// @vitest-environment node
import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import upath from "upath";
import { tmpdir } from "os";
import fs from "fs/promises";
import { ImageService } from "./imageService";
import { FileStorage, FSStorage } from "file-storage";
import { DatabaseService } from "./databaseService";
import { eventTable, imageTable } from "@/db";

let tmpDir: string;
let storage: FileStorage;
let dbService: DatabaseService;
let imageService: ImageService;

const mockEvents: (typeof eventTable.$inferInsert)[] = [
  {
    id: "birthday",
    name: "Birthday",
    startDate: new Date(),
    endDate: new Date(),
  },
  {
    id: "wedding",
    name: "Wedding",
    startDate: new Date(),
    endDate: new Date(),
  },
];

type MockImage = typeof imageTable.$inferInsert & { imageData: string };
const mockImages: MockImage[] = [
  {
    id: "image-1",
    eventId: "birthday",
    imageData: "",
  },
];

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(upath.join(tmpdir(), "test-imageService-"));
  storage = new FSStorage(tmpDir);
  dbService = await DatabaseService.create(storage).getOrThrow();
  imageService = new ImageService(dbService, storage);

  await dbService.db.insert(eventTable).values(mockEvents);
  await dbService.db.insert(imageTable).values(mockImages);
  await Promise.all(
    mockImages.map(({ id, imageData }) =>
      storage.write(`${id}.webp`, imageData).getOrThrow()
    )
  );
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true });
  vi.restoreAllMocks();
});

describe("ImageService", () => {
  it("Temp", async () => {
    expect(await imageService.getImages("birthday").getOrThrow()).toHaveLength(1);
  });
});
