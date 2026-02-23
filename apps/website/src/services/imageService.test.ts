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

const mockImageData: Buffer[] = [
  "UklGRpgAAABXRUJQVlA4IIwAAABwAgCdASoPAA8AAUAmJbACdAYwd2dm7KLX2flgAP71vYHO4Y3N7L8m20BqoD/9s8W6f7MwJ47iUuo6mo2cLVxnuo/O20m4Gw84D3fjBDBqrkZpcQ0r9QxvnZ30EnpHY7HYFVsqel1JCusf9WgFrW2TL+/cRGtH+A/46tFARCaB/kmzFBzXhGpNF1LAAA==",
  "UklGRpoAAABXRUJQVlA4II4AAABwAgCdASoPAA8AAUAmJYwCdAYuvmpigIIQjnUAAP7X3TXC7NYF9lM269VWbhJFInjaMjPlYFaMX0iafgeTq4jD+TCg0d/K62oKUEZKQYwP5X6Y8xR3FpR+jeairJWRQPE2KoQIMB4bjYgHp/OiXLO1fhXLg3tfoftmGJJBqJPDWYDitzMRK6DIFqVf9IgA",
  "UklGRrQAAABXRUJQVlA4IKgAAACwAgCdASoPAA8AAUAmJbACdLoANsBjw/ZnN7hJKAAA/t2flkJn/P9VuS7HH8IUD0nMr8GM6oGsKTBi6VNnDJHUDOxvj908s3cUABG+UeNOhYgr3gmSjSbOcGuYWxyFEQc9h7X+xyms4V94wZF3hAW5GU7Y3O5L+HBgyd69Of//hpe5He94h0+1stP2wnwF5xHZO/8SwLjeYc3+M9KbYYFOzrSdDHNAAAA=",
  "UklGRrIAAABXRUJQVlA4IKYAAACQAgCdASoPAA8AAUAmJYgCdDiMxykHTy50HtO8AAD++8G1B580sjDGPpDh93uU+bgfxCEm/3+2tc7RN22rSG4FqMYjjOvIZWgD/ZNezv/KyS2YaqxgJpl7uLr86Vw++V5DT9NfCapWpDoYoXSzivpGlEzsbSZS0xeHmlyxvl+v7f5jrsiEb7/gtD//YKU0VttwVoSyG47/Pe7ix8jv8BKs7gHbIAwA",
].map(data => Buffer.from(data, "base64"));

type MockImage = typeof imageTable.$inferInsert & { imageData: Buffer };
const mockImages: MockImage[] = [
  {
    id: "image-1",
    eventId: "birthday",
    isApproved: null,
    imageData: mockImageData[0]!,
  },
  {
    id: "image-2",
    eventId: "birthday",
    isApproved: true,
    imageData: mockImageData[1]!,
  },
  {
    id: "image-3",
    eventId: "wedding",
    isApproved: true,
    imageData: mockImageData[2]!,
  },
  {
    id: "image-4",
    eventId: "wedding",
    isApproved: false,
    imageData: mockImageData[3]!,
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
    expect(await imageService.getImages("birthday").getOrThrow()).toHaveLength(2);
    await imageService.uploadImage("birthday", mockImageData[3]!).getOrThrow();
    expect(await imageService.getImages("birthday").getOrThrow()).toHaveLength(3);
  });
});
