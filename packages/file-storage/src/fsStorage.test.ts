import { test, after, afterEach, mock } from "node:test";
import { equal, deepEqual } from "assert/strict";
import { FSStorage } from "./fsStorage";
import pathlib from "path";
import { tmpdir } from "os";
import fs from "fs";

const tmpDir = fs.mkdtempSync(pathlib.join(tmpdir(), "fsStorage-"));
const fsStorage = new FSStorage(tmpDir);

after(() => fs.rmSync(tmpDir, { recursive: true }));
afterEach(() => mock.reset());

test("Return Err when file creation fails", async () => {
  mock.method(fs.promises, "writeFile", () => {
    throw new Error();
  });
  const result = await fsStorage.write("test.txt", new Blob(["This will fail"]));
  equal(result.err, true);
});

test("FSStorage test", async () => {
  deepEqual(await fsStorage.list("/").unwrap(), []);

  await fsStorage.write("temp/test.txt", new Blob(["This is a test"])).unwrap();
  equal(
    await fsStorage
      .read("temp/test.txt")
      .map(b => b.text())
      .unwrap(),
    "This is a test"
  );

  deepEqual(await fsStorage.list("/").unwrap(), ["temp/"]);
  await fsStorage.delete("temp/").unwrap();
  deepEqual(await fsStorage.list("/").unwrap(), []);
});
