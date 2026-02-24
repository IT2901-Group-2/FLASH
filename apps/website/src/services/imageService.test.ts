// @vitest-environment node
import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import upath from "upath";
import { tmpdir } from "os";
import fs from "fs/promises";
import { ImageService } from "./imageService";
import { FSStorage } from "file-storage";
import { DatabaseService } from "./databaseService";
import { eventTable, imageTable } from "@/db";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Result } from "typescript-result";

let tmpDir: string;
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
  const storage = new FSStorage(tmpDir);
  const dbService = await DatabaseService.create(storage).getOrThrow();
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
        .getImages("birthday", { approval: "approved" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-2"]));

    expect(
      await imageService
        .getImages("birthday", { approval: "pending" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-1"]));

    expect(
      await imageService
        .getImages("wedding", { approval: "pending" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await imageService
        .getImages("wedding", { approval: "approved" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-3", "image-5"]));
  });

  it("Should correctly filter by combination", async () => {
    expect(
      await imageService
        .getImages("wedding", {
          id: ["image-5", "image-4", "image-1"],
          approval: "rejected",
        })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-4"]));

    expect(
      await imageService
        .getImages("wedding", {
          id: ["image-5", "image-4", "image-1"],
          approval: "approved",
        })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["image-5"]));
  });
});

describe("ImageService downloadImage", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "select").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await imageService.downloadImage("wedding", "image-3"));
  });

  it("Should return Err when image does not exist", async () => {
    Result.assertError(await imageService.downloadImage("wedding", "image-100"));
  });

  it("Should return Err when image belong to wrong event", async () => {
    Result.assertError(await imageService.downloadImage("wedding", "image-1"));
  });

  it("Should correctly download image", async () => {
    expect(
      await imageService
        .downloadImage("wedding", "image-3")
        .map(buff => buff.toString("base64"))
        .getOrThrow()
    ).toBe(mockImageData[2]!.toString("base64"));

    expect(
      await imageService
        .downloadImage("birthday", "image-1")
        .map(buff => buff.toString("base64"))
        .getOrThrow()
    ).toBe(mockImageData[0]!.toString("base64"));
  });
});

describe("ImageService uploadImage", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "insert").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await imageService.uploadImage("wedding", mockImageData[0]!));
  });

  it("Should return Err when event does not exist", async () => {
    Result.assertError(await imageService.uploadImage("funeral", mockImageData[0]!));
  });

  it("Should return Err when image is invalid", async () => {
    Result.assertError(await imageService.uploadImage("funeral", "not an image"));
  });

  it("Should correctly upload image", async () => {
    const flush = vi
      .spyOn(DatabaseService.prototype, "flush")
      .mockImplementation(() => {});

    const image1 = await imageService
      .uploadImage("wedding", mockImageData[2]!)
      .getOrThrow();

    expect(image1.eventId).toBe("wedding");
    expect(image1.isApproved).toBeNull();
    Result.assertOk(await imageService["storage"].read(`${image1.id}.webp`));
    expect(flush).toHaveBeenCalledOnce();

    const image2 = await imageService
      .uploadImage("birthday", mockImageData[3]!)
      .getOrThrow();

    expect(image2.eventId).toBe("birthday");
    expect(image2.isApproved).toBeNull();
    Result.assertOk(await imageService["storage"].read(`${image2.id}.webp`));
    expect(flush).toHaveBeenCalledTimes(2);
  });
});

describe("ImageService updateImage", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "insert").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await imageService.updateImage("wedding", "image-4", {}));
  });

  it("Should return Err when image does not exist", async () => {
    Result.assertError(await imageService.updateImage("wedding", "image-100", {}));
  });

  it("Should return Err when image belongs to wrong event", async () => {
    Result.assertError(await imageService.updateImage("wedding", "image-1", {}));
  });

  it("Should correctly update image", async () => {
    const flush = vi
      .spyOn(DatabaseService.prototype, "flush")
      .mockImplementation(() => {});

    const image1 = await imageService
      .updateImage("birthday", "image-1", { isApproved: true })
      .getOrThrow();

    expect(image1.eventId).toBe("birthday");
    expect(image1.id).toBe("image-1");
    expect(image1.isApproved).toBe(true);
    expect(flush).toHaveBeenCalledOnce();

    const image2 = await imageService
      .updateImage("wedding", "image-4", { isApproved: false })
      .getOrThrow();

    expect(image2.eventId).toBe("wedding");
    expect(image2.id).toBe("image-4");
    expect(image2.isApproved).toBe(false);
    expect(flush).toHaveBeenCalledTimes(2);

    const image3 = await imageService
      .updateImage("birthday", "image-1", { isApproved: null })
      .getOrThrow();

    expect(image3.eventId).toBe("birthday");
    expect(image3.id).toBe("image-1");
    expect(image3.isApproved).toBeNull();
    expect(flush).toHaveBeenCalledTimes(3);
  });
});

describe("ImageService deleteImage", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "delete").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await imageService.deleteImage("wedding", "image-4"));
  });

  it("Should return Err when image does not exist", async () => {
    Result.assertError(await imageService.deleteImage("wedding", "image-100"));
  });

  it("Should return Err when image belongs to wrong event", async () => {
    Result.assertError(await imageService.deleteImage("wedding", "image-1"));
  });

  it("Should delete image correctly", async () => {
    const flush = vi
      .spyOn(DatabaseService.prototype, "flush")
      .mockImplementation(() => {});

    const image1 = await imageService.deleteImage("wedding", "image-4").getOrThrow();

    expect(image1.eventId).toBe("wedding");
    expect(image1.id).toBe("image-4");
    expect(image1.isApproved).toBe(false);
    expect(flush).toHaveBeenCalledOnce();

    const image2 = await imageService.deleteImage("birthday", "image-1").getOrThrow();

    expect(image2.eventId).toBe("birthday");
    expect(image2.id).toBe("image-1");
    expect(image2.isApproved).toBeNull();
    expect(flush).toHaveBeenCalledTimes(2);
  });
});
