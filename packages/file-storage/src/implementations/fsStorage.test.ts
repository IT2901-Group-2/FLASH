import { describe, it, after, afterEach, mock } from "node:test";
import { equal, deepEqual } from "assert/strict";
import { FSStorage } from "./fsStorage";
import pathlib from "path";
import { tmpdir } from "os";
import fs from "fs";

const tmpDir = fs.mkdtempSync(pathlib.join(tmpdir(), "fsStorage-"));
const fsStorage = new FSStorage(tmpDir);

after(() => fs.rmSync(tmpDir, { recursive: true }));
afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true });
  fs.mkdirSync(tmpDir);
  mock.reset();
});

describe("FSStorage list directory", () => {
  it("Should return Err when listing non-existent directory", async () => {
    const result = await fsStorage.list("testdir");
    equal(result.err, true);
  });

  it("Should return empty list when listing empty directory", async () => {
    deepEqual(await fsStorage.list("/").unwrap(), []);

    fs.mkdirSync(pathlib.join(tmpDir, "testdir"));
    deepEqual(await fsStorage.list("testdir").unwrap(), []);
  });

  it("Should return correct file/directory names when listing directory", async () => {
    fs.mkdirSync(pathlib.join(tmpDir, "test"));
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir"));
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "foo.txt"), "");
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "bar"), "");
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir", "baz"));
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "baz", "test.txt"), "");
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir", "dir2"));

    deepEqual(
      await fsStorage
        .list("test/dir")
        .map(f => new Set(f))
        .unwrap(),
      new Set(["foo.txt", "bar", "baz/", "dir2/"])
    );
  });
});

describe("FSStorage read file", () => {
  it("Should return Err when reading non-existent file", async () => {
    const result = await fsStorage.read("testfile");
    equal(result.err, true);
  });

  it("Should return Err when reading directory", async () => {
    fs.mkdirSync(pathlib.join(tmpDir, "testdir"));

    const result = await fsStorage.read("testdir");
    equal(result.err, true);
  });

  it("Should return Err when reading file fails", async () => {
    fs.writeFileSync(pathlib.join(tmpDir, "testfile"), "");
    mock.method(fs.promises, "readFile", () => Promise.reject());

    const result = await fsStorage.read("testfile");
    equal(result.err, true);
  });

  it("Should return the contents of the file", async () => {
    fs.writeFileSync(pathlib.join(tmpDir, "testfile"), "This is a test");

    equal(
      await fsStorage
        .read("testfile")
        .map(b => b.text())
        .unwrap(),
      "This is a test"
    );
  });
});

describe("FSStorage create directory", () => {
  it("Should return Err when directory creation fails", async () => {
    mock.method(fs.promises, "mkdir", () => Promise.reject());

    const result = await fsStorage.mkdir("testdir");
    equal(result.err, true);
  });

  it("Should create directory", async () => {
    await fsStorage.mkdir("testdir").unwrap();
    equal(fs.statSync(pathlib.join(tmpDir, "testdir")).isDirectory(), true);
  });

  it("Should create directory recursively", async () => {
    await fsStorage.mkdir("test/dir/foo").unwrap();
    equal(fs.statSync(pathlib.join(tmpDir, "test", "dir", "foo")).isDirectory(), true);
  });
});
