import { FullConfig } from "@playwright/test";
import { DB_TEMP_DIR } from "./playwright.config";
import fs from "fs/promises";

export default async function globalTeardown(_: FullConfig) {
  await fs.rm(DB_TEMP_DIR, { recursive: true });
}
