import { jest, afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { Bucket, Storage } from "@google-cloud/storage";
import { Result } from "typescript-result";
import { GcloudStorage } from "./gcloudStorage";

let container: StartedTestContainer;
let bucket: Bucket;

beforeEach(async () => {
  container = await new GenericContainer("igiwa001/google-storage-testbench")
    .withExposedPorts(9000)
    .withStartupTimeout(2000)
    .start();
  bucket = await new Storage({
    projectId: "test-project",
    apiEndpoint: `http://${container.getHost()}:${container.getMappedPort(9000)}`,
  })
    .createBucket("test-bucket")
    .then(res => res[0]);
}, 30 * 1000);

afterEach(async () => {
  container.stop();
  jest.restoreAllMocks();
});

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
