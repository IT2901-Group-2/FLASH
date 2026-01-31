import { jest, describe, it, afterAll, afterEach, expect } from "@jest/globals";
import { FSStorage } from "./fsStorage";
import pathlib from "path";
import { tmpdir } from "os";
import fs from "fs";
import { Result } from "typescript-result";

const tmpDir = fs.mkdtempSync(pathlib.join(tmpdir(), "fsStorage-"));
const fsStorage = new FSStorage(tmpDir);

afterAll(() => fs.rmSync(tmpDir, { recursive: true }));
afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true });
  fs.mkdirSync(tmpDir);
  jest.restoreAllMocks();
});

describe("FSStorage list directory", () => {
  it("Should return Err when listing non-existent directory", async () => {
    Result.assertError(await fsStorage.list("testdir"));
  });

  it("Should return empty list when listing empty directory", async () => {
    expect(await fsStorage.list("/").getOrThrow()).toStrictEqual([]);

    fs.mkdirSync(pathlib.join(tmpDir, "testdir"));
    expect(await fsStorage.list("testdir").getOrThrow()).toStrictEqual([]);
  });

  it("Should return correct file/directory names when listing directory", async () => {
    fs.mkdirSync(pathlib.join(tmpDir, "test"));
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir"));
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "foo.txt"), "");
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "bar"), "");
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir", "baz"));
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "baz", "test.txt"), "");
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir", "dir2"));

    expect(
      await fsStorage
        .list("test/dir")
        .map(f => new Set(f))
        .getOrThrow()
    ).toStrictEqual(new Set(["foo.txt", "bar", "baz/", "dir2/"]));
  });
});

describe("FSStorage read file", () => {
  it("Should return Err when reading non-existent file", async () => {
    Result.assertError(await fsStorage.read("testfile"));
  });

  it("Should return Err when reading directory", async () => {
    fs.mkdirSync(pathlib.join(tmpDir, "testdir"));

    Result.assertError(await fsStorage.read("testdir"));
  });

  it("Should return Err when reading file fails", async () => {
    fs.writeFileSync(pathlib.join(tmpDir, "testfile"), "");
    jest.spyOn(fs.promises, "readFile").mockImplementationOnce(() => Promise.reject());

    Result.assertError(await fsStorage.read("testfile"));
  });

  it("Should return the contents of the file", async () => {
    fs.writeFileSync(pathlib.join(tmpDir, "testfile"), "This is a test");

    expect(
      await fsStorage
        .read("testfile")
        .map(b => b.text())
        .getOrThrow()
    ).toBe("This is a test");
  });
});

describe("FSStorage create directory", () => {
  it("Should return Err when directory creation fails", async () => {
    jest.spyOn(fs.promises, "mkdir").mockImplementationOnce(() => Promise.reject());

    Result.assertError(await fsStorage.mkdir("testdir"));
  });

  it("Should create directory", async () => {
    await fsStorage.mkdir("testdir").getOrThrow();
    expect(fs.statSync(pathlib.join(tmpDir, "testdir")).isDirectory()).toBe(true);
  });

  it("Should create directory recursively", async () => {
    await fsStorage.mkdir("test/dir/foo").getOrThrow();
    expect(fs.statSync(pathlib.join(tmpDir, "test", "dir", "foo")).isDirectory()).toBe(
      true
    );
  });
});

describe("FSStorage write file", () => {
  it("Should return Err when file creation fails", async () => {
    jest.spyOn(fs.promises, "writeFile").mockImplementationOnce(() => Promise.reject());

    Result.assertError(await fsStorage.write("testfile", new Blob([])));
  });

  it("Should return Err when directory creation fails", async () => {
    jest.spyOn(fs.promises, "mkdir").mockImplementationOnce(() => Promise.reject());

    Result.assertError(await fsStorage.write("testdir/testfile", new Blob([])));
  });

  it("Should create file with correct contents", async () => {
    await fsStorage.write("testfile", new Blob(["This is a test"])).getOrThrow();

    expect(fs.readFileSync(pathlib.join(tmpDir, "testfile")).toString()).toBe(
      "This is a test"
    );
  });

  it("Should create file with correct contents recursively", async () => {
    await fsStorage.write("foo/bar/testfile", new Blob(["This is a test"])).getOrThrow();

    expect(
      fs.readFileSync(pathlib.join(tmpDir, "foo", "bar", "testfile")).toString()
    ).toBe("This is a test");
  });
});

describe("FSStorage delete file/directory", () => {
  it("Should return Err when deleting non-existent file/directory", async () => {
    Result.assertError(await fsStorage.delete("testfile"));
  });

  it("Should return Err when file/directory deletion fails", async () => {
    fs.writeFileSync(pathlib.join(tmpDir, "testfile"), "");
    jest.spyOn(fs.promises, "rm").mockImplementationOnce(() => Promise.reject());

    Result.assertError(await fsStorage.delete("testfile"));
  });

  it("Should delete file", async () => {
    fs.writeFileSync(pathlib.join(tmpDir, "testfile"), "");

    await fsStorage.delete("testfile").getOrThrow();
    expect(
      fs.statSync(pathlib.join(tmpDir, "testfile"), { throwIfNoEntry: false })
    ).toBeUndefined();
  });

  it("Should delete file within directory", async () => {
    fs.mkdirSync(pathlib.join(tmpDir, "testdir"));
    fs.writeFileSync(pathlib.join(tmpDir, "testdir", "testfile"), "");

    await fsStorage.delete("testdir/testfile").getOrThrow();
    expect(fs.statSync(pathlib.join(tmpDir, "testdir")).isDirectory()).toBe(true);
    expect(
      fs.statSync(pathlib.join(tmpDir, "testdir", "testfile"), { throwIfNoEntry: false })
    ).toBeUndefined();
  });

  it("Should delete empty directory", async () => {
    fs.mkdirSync(pathlib.join(tmpDir, "testdir"));

    await fsStorage.delete("testdir").getOrThrow();
    expect(
      fs.statSync(pathlib.join(tmpDir, "testdir"), { throwIfNoEntry: false })
    ).toBeUndefined();
  });

  it("Should delete directory with content", async () => {
    fs.mkdirSync(pathlib.join(tmpDir, "test"));
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir"));
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "foo.txt"), "");
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "bar"), "");
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir", "baz"));
    fs.writeFileSync(pathlib.join(tmpDir, "test", "dir", "baz", "test.txt"), "");
    fs.mkdirSync(pathlib.join(tmpDir, "test", "dir", "dir2"));

    await fsStorage.delete("test").getOrThrow();
    expect(
      fs.statSync(pathlib.join(tmpDir, "test"), { throwIfNoEntry: false })
    ).toBeUndefined();
  });
});
