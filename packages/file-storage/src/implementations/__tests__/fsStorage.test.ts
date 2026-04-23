import { jest, describe, it, afterEach, expect, beforeEach } from "@jest/globals";
import { FSStorage } from "../fsStorage";
import upath from "upath";
import { tmpdir } from "os";
import fs from "fs";
import { Result } from "typescript-result";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(upath.join(tmpdir(), "test-fsStorage-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true });
  jest.restoreAllMocks();
});

describe("FSStorage constructor", () => {
  it("Should create directory if it does not exist", () => {
    fs.rmSync(tmpDir, { recursive: true });
    new FSStorage(tmpDir);
    expect(fs.statSync(tmpDir).isDirectory()).toBe(true);
  });
});

describe("FSStorage list directory", () => {
  it("Should return Err when listing non-existent directory", async () => {
    Result.assertError(await new FSStorage(tmpDir).list("testdir"));
  });

  it("Should return empty list when listing empty directory", async () => {
    const fsStorage = new FSStorage(tmpDir);

    expect(await fsStorage.list("/").getOrThrow()).toStrictEqual([]);

    fs.mkdirSync(upath.join(tmpDir, "testdir"));
    expect(await fsStorage.list("testdir").getOrThrow()).toStrictEqual([]);
  });

  it("Should return correct file/directory names when listing directory", async () => {
    fs.mkdirSync(upath.join(tmpDir, "test"));
    fs.mkdirSync(upath.join(tmpDir, "test", "dir"));
    fs.writeFileSync(upath.join(tmpDir, "test", "dir", "foo.txt"), "");
    fs.writeFileSync(upath.join(tmpDir, "test", "dir", "bar"), "");
    fs.mkdirSync(upath.join(tmpDir, "test", "dir", "baz"));
    fs.writeFileSync(upath.join(tmpDir, "test", "dir", "baz", "test.txt"), "");
    fs.mkdirSync(upath.join(tmpDir, "test", "dir", "dir2"));

    expect(
      await new FSStorage(tmpDir)
        .list("test/dir")
        .map(f => new Set(f))
        .getOrThrow()
    ).toStrictEqual(new Set(["foo.txt", "bar", "baz/", "dir2/"]));
  });
});

describe("FSStorage read file", () => {
  it("Should return Err when reading non-existent file", async () => {
    Result.assertError(await new FSStorage(tmpDir).read("testfile"));
  });

  it("Should return Err when reading directory", async () => {
    fs.mkdirSync(upath.join(tmpDir, "testdir"));

    Result.assertError(await new FSStorage(tmpDir).read("testdir"));
  });

  it("Should return Err when reading file fails", async () => {
    fs.writeFileSync(upath.join(tmpDir, "testfile"), "");
    jest.spyOn(fs.promises, "readFile").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new FSStorage(tmpDir).read("testfile"));
  });

  it("Should return the contents of the file", async () => {
    fs.writeFileSync(upath.join(tmpDir, "testfile"), "This is a test");

    expect(
      await new FSStorage(tmpDir)
        .read("testfile")
        .map(b => b.toString())
        .getOrThrow()
    ).toBe("This is a test");
  });
});

describe("FSStorage create directory", () => {
  it("Should return Err when directory creation fails", async () => {
    jest.spyOn(fs.promises, "mkdir").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new FSStorage(tmpDir).mkdir("testdir"));
  });

  it("Should create directory", async () => {
    await new FSStorage(tmpDir).mkdir("testdir").getOrThrow();
    expect(fs.statSync(upath.join(tmpDir, "testdir")).isDirectory()).toBe(true);
  });

  it("Should create directory recursively", async () => {
    await new FSStorage(tmpDir).mkdir("test/dir/foo").getOrThrow();
    expect(fs.statSync(upath.join(tmpDir, "test", "dir", "foo")).isDirectory()).toBe(
      true
    );
  });
});

describe("FSStorage write file", () => {
  it("Should return Err when file creation fails", async () => {
    jest.spyOn(fs.promises, "writeFile").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new FSStorage(tmpDir).write("testfile", ""));
  });

  it("Should return Err when directory creation fails", async () => {
    jest.spyOn(fs.promises, "mkdir").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new FSStorage(tmpDir).write("testdir/testfile", ""));
  });

  it("Should create file with correct contents", async () => {
    await new FSStorage(tmpDir).write("testfile", "This is a test").getOrThrow();

    expect(fs.readFileSync(upath.join(tmpDir, "testfile")).toString()).toBe(
      "This is a test"
    );
  });

  it("Should create file with correct contents recursively", async () => {
    await new FSStorage(tmpDir).write("foo/bar/testfile", "This is a test").getOrThrow();

    expect(fs.readFileSync(upath.join(tmpDir, "foo", "bar", "testfile")).toString()).toBe(
      "This is a test"
    );
  });
});

describe("FSStorage delete file", () => {
  it("Should return Err when deleting non-existent file", async () => {
    Result.assertError(await new FSStorage(tmpDir).rm("testfile"));
  });

  it("Should return Err when file deletion fails", async () => {
    fs.writeFileSync(upath.join(tmpDir, "testfile"), "");
    jest.spyOn(fs.promises, "rm").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new FSStorage(tmpDir).rm("testfile"));
  });

  it("Should return Err when deleting directory", async () => {
    fs.mkdirSync(upath.join(tmpDir, "testdir"));

    Result.assertError(await new FSStorage(tmpDir).rm("testdir"));
  });

  it("Should delete file", async () => {
    fs.writeFileSync(upath.join(tmpDir, "testfile"), "");

    await new FSStorage(tmpDir).rm("testfile").getOrThrow();

    expect(
      fs.statSync(upath.join(tmpDir, "testfile"), { throwIfNoEntry: false })
    ).toBeUndefined();
  });

  it("Should delete file within directory", async () => {
    fs.mkdirSync(upath.join(tmpDir, "testdir"));
    fs.writeFileSync(upath.join(tmpDir, "testdir", "testfile"), "");

    await new FSStorage(tmpDir).rm("testdir/testfile").getOrThrow();

    expect(fs.statSync(upath.join(tmpDir, "testdir")).isDirectory()).toBe(true);
    expect(
      fs.statSync(upath.join(tmpDir, "testdir", "testfile"), { throwIfNoEntry: false })
    ).toBeUndefined();
  });
});

describe("FSStorage delete directory", () => {
  it("Should return Err when deleting non-existent directory", async () => {
    Result.assertError(await new FSStorage(tmpDir).rmdir("testdir"));
  });

  it("Should return Err when directory deletion fails", async () => {
    fs.writeFileSync(upath.join(tmpDir, "testfile"), "");
    jest.spyOn(fs.promises, "rm").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new FSStorage(tmpDir).rmdir("testfile"));
  });

  it("Should return Err when deleting file", async () => {
    fs.writeFileSync(upath.join(tmpDir, "testfile"), "");

    Result.assertError(await new FSStorage(tmpDir).rmdir("testfile"));
  });

  it("Should delete empty directory", async () => {
    fs.mkdirSync(upath.join(tmpDir, "testdir"));

    await new FSStorage(tmpDir).rmdir("testdir").getOrThrow();
    expect(
      fs.statSync(upath.join(tmpDir, "testdir"), { throwIfNoEntry: false })
    ).toBeUndefined();
  });

  it("Should delete directory with content", async () => {
    fs.mkdirSync(upath.join(tmpDir, "test"));
    fs.mkdirSync(upath.join(tmpDir, "test", "dir"));
    fs.writeFileSync(upath.join(tmpDir, "test", "dir", "foo.txt"), "");
    fs.writeFileSync(upath.join(tmpDir, "test", "dir", "bar"), "");
    fs.mkdirSync(upath.join(tmpDir, "test", "dir", "baz"));
    fs.writeFileSync(upath.join(tmpDir, "test", "dir", "baz", "test.txt"), "");
    fs.mkdirSync(upath.join(tmpDir, "test", "dir2"));

    await new FSStorage(tmpDir).rmdir("test/dir").getOrThrow();

    expect(fs.statSync(upath.join(tmpDir, "test")).isDirectory()).toBe(true);
    expect(fs.statSync(upath.join(tmpDir, "test", "dir2")).isDirectory()).toBe(true);
    for (const path of [
      upath.join(tmpDir, "test", "dir"),
      upath.join(tmpDir, "test", "dir", "foo.txt"),
      upath.join(tmpDir, "test", "dir", "bar"),
      upath.join(tmpDir, "test", "dir", "baz"),
      upath.join(tmpDir, "test", "dir", "baz", "test.txt"),
    ]) {
      expect(fs.statSync(path, { throwIfNoEntry: false })).toBeUndefined();
    }
  });
});
