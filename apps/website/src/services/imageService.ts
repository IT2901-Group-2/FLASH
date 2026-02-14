import { FileStorage, FSStorage } from "file-storage";
import { tmpdir } from "os";
import upath from "upath";
import { drizzle } from "drizzle-orm/better-sqlite3";
import schema, { getDatabase, testTable } from "@/db";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export class ImageService {
  private readonly storage: FileStorage;
  private readonly db: Database;

  constructor(storage: FileStorage, db: Database) {
    this.storage = storage;
    this.db = db;
  }

  async test(): Promise<string> {
    const rows = await this.db.select({ val: testTable.val }).from(testTable);
    return JSON.stringify(rows.map(r => r.val));
  }
}

const fileStorage = new FSStorage(upath.join(tmpdir(), "foto-app-images"));
const db = await getDatabase(fileStorage).getOrThrow();
export const imageService = new ImageService(fileStorage, db);
