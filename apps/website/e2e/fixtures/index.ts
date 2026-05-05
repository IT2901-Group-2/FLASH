import { test as navTest } from "./navigation";
import { mergeTests } from "@playwright/test";
import { test as appTest } from "./app";
import { createReadStream } from "fs";
import { createHash } from "crypto";
import path from "path";

export const test = mergeTests(appTest, navTest);
export { expect } from "@playwright/test";

export const sampleImage = path.join(__dirname, "sample.jpg");

/**
 * Calculates the md5 checksum of a file.
 *
 * @param path The path to the file.
 * @returns The md5 checksum of the given file
 */
export async function getFileHash(path: string): Promise<string> {
  const hash = createHash("md5");
  await createReadStream(path).forEach(async chunk => {
    hash.update(chunk);
  });
  return hash.digest("hex");
}
