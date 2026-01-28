import { afterAll, expect, test } from "@jest/globals";
import { FSStorage } from "./fsStorage";
import pathlib from "path";
import { tmpdir } from "os";
import fs from "fs";

const tmpDir = fs.mkdtempSync(pathlib.join(tmpdir(), "fsStorage-"));
const fsStorage = new FSStorage(tmpDir);

afterAll(() => fs.rmSync(tmpDir, { recursive: true }));

test("FSStorage test", async () => {
  expect(await fsStorage.list("/").unwrap()).toHaveLength(0);

  await fsStorage.write("temp/test.txt", new Blob(["This is a test"])).unwrap();
  expect(
    await fsStorage
      .read("temp/test.txt")
      .map(b => b.text())
      .unwrap()
  ).toBe("This is a test");

  expect(await fsStorage.list("/").unwrap()).toStrictEqual(["temp/"]);
  await fsStorage.delete("temp/").unwrap();
  expect(await fsStorage.list("/").unwrap()).toHaveLength(0);
});
