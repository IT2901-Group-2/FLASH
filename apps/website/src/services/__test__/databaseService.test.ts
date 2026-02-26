// @vitest-environment node
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import Sqlite, { type Database } from "better-sqlite3";
import { FileStorage, FSStorage } from "file-storage";
import { DatabaseService } from "../databaseService";
import { Result } from "typescript-result";
import { randomUUID } from "crypto";
import { tmpdir } from "os";
import upath from "upath";
import fs from "fs";

function createTestTable(db: Database): void {
  db.exec("CREATE TABLE test_databaseService (data TEXT NOT NULL)");
}

function insertTestData(db: Database, data: string): void {
  db.exec(`INSERT INTO test_databaseService VALUES ('${data}')`);
}

function getTestData(db: Database): string[] {
  const rows = db.prepare(`SELECT data FROM test_databaseService`).all() as {
    data: string;
  }[];
  return rows.map(row => row.data);
}

let tmpDir: string;
let storage: FileStorage;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(upath.join(tmpdir(), "test-databaseService-"));
  storage = new FSStorage(tmpDir);

  vi.spyOn(
    DatabaseService as unknown as {
      migrateDatabase: (typeof DatabaseService)["migrateDatabase"];
    },
    "migrateDatabase"
  ).mockImplementationOnce(Result.ok);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true });
  vi.restoreAllMocks();
});

describe("DatabaseService initialize", () => {
  it("Should throw an error when accessing db before initialization", () => {
    expect(() => new DatabaseService(storage).db).toThrow();
  });

  it("Should return Err when database migration fails", async () => {
    vi.restoreAllMocks();
    vi.spyOn(
      DatabaseService as unknown as {
        migrateDatabase: (typeof DatabaseService)["migrateDatabase"];
      },
      "migrateDatabase"
    ).mockImplementationOnce(() => Result.error(new Error("")));

    Result.assertError(await new DatabaseService(storage).initialize());
  });

  it("Should create empty database", async () => {
    const dbService = new DatabaseService(storage, "database.db");
    expect(await dbService.initialize().getOrThrow()).toBe(false);

    dbService.flush();
    await dbService["flushPromise"];

    await storage.read("database.db").getOrThrow();
  });

  it("Should open existing database", async () => {
    const data = new Array(10).fill(null).map(() => randomUUID());
    const db = new Sqlite(":memory:");

    createTestTable(db);
    data.forEach(d => insertTestData(db, d));
    await storage.write("database.db", db.serialize());

    const dbService = new DatabaseService(storage, "database.db");
    expect(await dbService.initialize().getOrThrow()).toBe(true);

    expect(new Set(getTestData(dbService.db.$client))).toStrictEqual(new Set(data));
  });
});

describe("DatabaseService flush", () => {
  it("Should flush changes to file", async () => {
    const data = new Array(10).fill(null).map(() => randomUUID());

    const dbService = new DatabaseService(storage, "database.db");
    await dbService.initialize().getOrThrow();

    createTestTable(dbService.db.$client);
    data.forEach(d => insertTestData(dbService.db.$client, d));

    dbService.flush();
    expect(dbService["flushPromise"]).not.toBeNull();
    await dbService["flushPromise"];

    const db = new Sqlite(await storage.read("database.db").getOrThrow());
    expect(new Set(getTestData(db))).toStrictEqual(new Set(data));
  });

  it("Should debounce flushes", async () => {
    const dbService = new DatabaseService(storage, "database.db");
    await dbService.initialize().getOrThrow();

    const flushOriginal = dbService["flushDatabase"].bind(dbService);
    const flushDatabase = vi
      .spyOn(
        dbService as unknown as {
          flushDatabase: (typeof DatabaseService.prototype)["flushDatabase"];
        },
        "flushDatabase"
      )
      .mockImplementation(() =>
        flushOriginal().then(() => new Promise(resolve => setTimeout(resolve, 100)))
      );

    dbService.flush();
    expect(dbService["flushPromise"]).not.toBeNull();

    dbService.flush();
    dbService.flush();
    dbService.flush();
    dbService.flush();

    await dbService["flushPromise"];
    expect(dbService["flushPromise"]).toBeNull();

    expect(flushDatabase).toHaveBeenCalledTimes(2);
  });
});
