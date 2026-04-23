import {
  jest,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { Bucket, Storage, File } from "@google-cloud/storage";
import { Result } from "typescript-result";
import { GcloudStorage } from "../gcloudStorage";
import { randomUUID } from "crypto";

let container: StartedTestContainer;
let storage: Storage;
let bucket: Bucket;

beforeAll(async () => {
  container = await new GenericContainer("igiwa001/google-storage-testbench")
    .withExposedPorts(9000)
    .withStartupTimeout(2000)
    .start();
  storage = new Storage({
    projectId: "test-project",
    apiEndpoint: `http://${container.getHost()}:${container.getMappedPort(9000)}`,
  });
}, 3e4);

beforeEach(async () => {
  bucket = await storage.createBucket(`test-bucket-${randomUUID()}`).then(res => res[0]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => container.stop());

describe("GcloudStorage list directory", () => {
  it("Should return Err when listing non-existent directory", async () => {
    Result.assertError(await new GcloudStorage(bucket).list("testdir"));
  });

  it("Should return empty list when listing empty directory", async () => {
    const gcloudStorage = new GcloudStorage(bucket);

    expect(await gcloudStorage.list("/").getOrThrow()).toStrictEqual([]);

    await bucket.file("testdir/").save("");
    expect(await gcloudStorage.list("testdir").getOrThrow()).toStrictEqual([]);
  });

  it("Should return correct file/directory names when listing directory", async () => {
    await bucket.file("test/").save("");
    await bucket.file("test/dir/").save("");
    await bucket.file("test/dir/foo.txt").save("");
    await bucket.file("test/dir/bar").save("");
    await bucket.file("test/dir/baz/").save("");
    await bucket.file("test/dir/baz/test.txt").save("");
    await bucket.file("test/dir/dir2/").save("");

    expect(
      await new GcloudStorage(bucket)
        .list("test/dir")
        .map(f => new Set(f))
        .getOrThrow()
    ).toStrictEqual(new Set(["foo.txt", "bar", "baz/", "dir2/"]));
  });
});

describe("GcloudStorage read file", () => {
  it("Should return Err when reading non-existent file", async () => {
    Result.assertError(await new GcloudStorage(bucket).read("testfile"));
  });

  it("Should return Err when reading directory", async () => {
    await bucket.file("testdir/").save("");

    Result.assertError(await new GcloudStorage(bucket).read("testdir/"));
  });

  it("Should return Err when reading file fails", async () => {
    await bucket.file("testfile").save("");
    jest.spyOn(File.prototype, "download").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new GcloudStorage(bucket).read("testfile"));
  });

  it("Should return the contents of the file", async () => {
    await bucket.file("testfile").save("This is a test");

    expect(
      await new GcloudStorage(bucket)
        .read("testfile")
        .map(b => b.toString())
        .getOrThrow()
    ).toBe("This is a test");
  });
});

describe("GcloudStorage create directory", () => {
  it("Shuold return Err when directory creation fails", async () => {
    jest.spyOn(File.prototype, "save").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new GcloudStorage(bucket).mkdir("testdir"));
  });

  it("Should create directory", async () => {
    await new GcloudStorage(bucket).mkdir("testdir").getOrThrow();

    expect(
      await bucket
        .file("testdir/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
  });

  it("Should create directory recursively", async () => {
    await new GcloudStorage(bucket).mkdir("test/dir/foo").getOrThrow();

    expect(
      await bucket
        .file("test/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
    expect(
      await bucket
        .file("test/dir/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
    expect(
      await bucket
        .file("test/dir/foo/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
  });
});

describe("GcloudStorage write file", () => {
  it("Should return Err when file creation fails", async () => {
    jest.spyOn(File.prototype, "save").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new GcloudStorage(bucket).write("testfile", ""));
  });

  it("Should return Err when directory creation fails", async () => {
    jest.spyOn(File.prototype, "save").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new GcloudStorage(bucket).write("testdir/testfile", ""));
  });

  it("Should create file with correct contents", async () => {
    await new GcloudStorage(bucket).write("testfile", "This is a test").getOrThrow();

    expect(
      await bucket
        .file("testfile")
        .download()
        .then(res => res[0].toString())
    ).toBe("This is a test");
  });

  it("Should create file with correct contents recursively", async () => {
    await new GcloudStorage(bucket)
      .write("foo/bar/testfile", "This is a test")
      .getOrThrow();

    expect(
      await bucket
        .file("foo/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
    expect(
      await bucket
        .file("foo/bar/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
    expect(
      await bucket
        .file("foo/bar/testfile")
        .download()
        .then(res => res[0].toString())
    ).toBe("This is a test");
  });
});

describe("GcloudStorage delete file", () => {
  it("Should return Err when deleting non-existent file", async () => {
    Result.assertError(await new GcloudStorage(bucket).rm("testfile"));
  });

  it("Should return Err when file deletion fails", async () => {
    await bucket.file("testfile").save("");
    jest.spyOn(File.prototype, "delete").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new GcloudStorage(bucket).rm("testfile"));
  });

  it("Should return Err when deleting directory", async () => {
    await bucket.file("testdir/").save("");

    Result.assertError(await new GcloudStorage(bucket).rm("testdir"));
  });

  it("Should delete file", async () => {
    await bucket.file("testfile").save("");

    await new GcloudStorage(bucket).rm("testfile").getOrThrow();

    expect(
      await bucket
        .file("testfile")
        .exists()
        .then(res => res[0])
    ).toBe(false);
  });

  it("Should delete file within directory", async () => {
    await bucket.file("testdir/").save("");
    await bucket.file("testdir/testfile").save("");

    await new GcloudStorage(bucket).rm("testdir/testfile").getOrThrow();

    expect(
      await bucket
        .file("testdir/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
    expect(
      await bucket
        .file("testdir/testfile")
        .exists()
        .then(res => res[0])
    ).toBe(false);
  });
});

describe("GcloudStorage delete directory", () => {
  it("Should return Err when deleting non-existent directory", async () => {
    Result.assertError(await new GcloudStorage(bucket).rmdir("testdir"));
  });

  it("Should return Err when directory deletion fails", async () => {
    await bucket.file("testdir/").save("");
    jest.spyOn(File.prototype, "delete").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await new GcloudStorage(bucket).rmdir("testdir"));
  });

  it("Should return Err when deleting file", async () => {
    await bucket.file("testfile").save("");

    Result.assertError(await new GcloudStorage(bucket).rmdir("testfile"));
  });

  it("Should delete empty directory", async () => {
    await bucket.file("testdir/").save("");

    await new GcloudStorage(bucket).rmdir("testdir").getOrThrow();

    expect(
      await bucket
        .file("testdir/")
        .exists()
        .then(res => res[0])
    ).toBe(false);
  });

  it("Should delete directory with content", async () => {
    await bucket.file("test/").save("");
    await bucket.file("test/dir/").save("");
    await bucket.file("test/dir/foo.txt").save("");
    await bucket.file("test/dir/bar").save("");
    await bucket.file("test/dir/baz/").save("");
    await bucket.file("test/dir/baz/test.txt").save("");
    await bucket.file("test/dir2/").save("");

    await new GcloudStorage(bucket).rmdir("test/dir").getOrThrow();

    expect(
      await bucket
        .file("test/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
    expect(
      await bucket
        .file("test/dir2/")
        .exists()
        .then(res => res[0])
    ).toBe(true);
    for (const dir of [
      "test/dir/",
      "test/dir/foo.txt",
      "test/dir/bar",
      "test/dir/baz/",
      "test/dir/baz/test.txt",
      "test/dir/dir2/",
    ]) {
      expect(
        await bucket
          .file(dir)
          .exists()
          .then(res => res[0])
      ).toBe(false);
    }
  });
});
