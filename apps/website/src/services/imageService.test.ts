// @vitest-environment node
import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import upath from "upath";
import { tmpdir } from "os";
import fs from "fs/promises";
import { ImageService } from "./imageService";
import { FileStorage, FSStorage } from "file-storage";
import { DatabaseService } from "./databaseService";
import { eventTable, imageTable } from "@/db";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Result } from "typescript-result";

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
  {
    id: "image-5",
    eventId: "wedding",
    isApproved: true,
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

describe("ImageService getImages", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "select").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await imageService.getImages("wedding"));
  });

  it("Should correctly fetch all event images", async () => {
    expect(
      await imageService
        .getImages("birthday")
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-1", "image-2"]));

    expect(
      await imageService
        .getImages("wedding")
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-3", "image-4", "image-5"]));

    expect(
      await imageService
        .getImages("funeral")
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));
  });

  it("Should correctly filter by id", async () => {
    expect(
      await imageService
        .getImages("birthday", { id: ["image-1", "image-20", "image-4"] })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-1"]));

    expect(
      await imageService
        .getImages("wedding", { id: ["image-5", "image-4", "image-1"] })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-4", "image-5"]));
  });

  it("Should correctly filter by approval status", async () => {
    expect(
      await imageService
        .getImages("birthday", { status: true })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-2"]));

    expect(
      await imageService
        .getImages("birthday", { status: null })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-1"]));

    expect(
      await imageService
        .getImages("wedding", { status: null })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await imageService
        .getImages("wedding", { status: true })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-3", "image-5"]));
  });

  it("Should correctly filter by combination", async () => {
    expect(
      await imageService
        .getImages("wedding", { id: ["image-5", "image-4", "image-1"], status: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-4"]));

    expect(
      await imageService
        .getImages("wedding", { id: ["image-5", "image-4", "image-1"], status: true })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-5"]));
  });
});
