import { jest, afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import {
  CloudStorageEmulatorContainer,
  StartedCloudStorageEmulatorContainer,
} from "@testcontainers/gcloud";
import { Bucket, Storage } from "@google-cloud/storage";

let container: StartedCloudStorageEmulatorContainer;
let bucket: Bucket;

beforeEach(async () => {
  container = await new CloudStorageEmulatorContainer("fsouza/fake-gcs-server").start();
  bucket = await new Storage({
    projectId: "test-project",
    apiEndpoint: container.getExternalUrl(),
  })
    .createBucket("test-bucket")
    .then(res => res[0]);
});

afterEach(async () => {
  container.stop();
  jest.restoreAllMocks();
});

describe("Temp", () => {
  it("temp", async () => {
    expect(bucket.name).toBe("test-bucket");
  });
});
