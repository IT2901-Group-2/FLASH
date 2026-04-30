import { FullConfig } from "@playwright/test";
import { DB_FIXTURE_DIR, DB_TEMP_DIR } from "./playwright.config";
import fs from "fs/promises";

export default async function globalSetup(_: FullConfig) {
  await fs.rm(DB_TEMP_DIR, { recursive: true, force: true });
  await fs.mkdir(DB_TEMP_DIR);
  await fs.cp(DB_FIXTURE_DIR, DB_TEMP_DIR, { recursive: true });
}
