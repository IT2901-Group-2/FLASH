import { jest, afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { Bucket, Storage } from "@google-cloud/storage";

const image = new GenericContainer("igiwa001/google-storage-testbench");
let container: StartedTestContainer;
let bucket: Bucket;

beforeEach(async () => {
  container = await image.withExposedPorts(9000).withStartupTimeout(2000).start();
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

describe("Temp", () => {
  it("temp", async () => {
    expect(bucket.name).toBe("test-bucket");
  });
});
