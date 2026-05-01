import { createReadStream } from "fs";
import { createHash } from "crypto";
import { test as appTest } from "./app";
import { test as navTest } from "./navigation";
import { mergeTests } from "@playwright/test";

export const test = mergeTests(appTest, navTest);
export { expect } from "@playwright/test";

export async function getFileHash(path: string): Promise<string> {
  const hash = createHash("md5");
  await createReadStream(path).forEach(async chunk => {
    hash.update(chunk);
  });
  return hash.digest("hex");
}
