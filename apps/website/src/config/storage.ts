import { FileStorage, FSStorage, GcloudStorage } from "file-storage";
import { Storage, StorageOptions } from "@google-cloud/storage";
import { tmpdir } from "os";
import upath from "upath";

export type StorageConfig =
  | { backend: "fs"; dir: string }
  | { backend: "gcloud"; bucket: string; options: StorageOptions };

export function getStorageConfig(): StorageConfig {
  const backend = process.env.STORAGE_BACKEND ?? "fs";

  switch (backend) {
    case "fs":
      return {
        backend,
        dir: process.env.STORAGE_DIR ?? upath.join(tmpdir(), "foto-app"),
      };

    case "gcloud":
      const bucket = process.env.GCP_BUCKET;
      if (bucket === undefined) {
        throw new Error("Gcloud bucket not specified");
      }

      const projectId = process.env.GCP_PROJECT_ID;
      const client_email = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
      const private_key = process.env.GCP_PRIVATE_KEY;
      const hasCredentials =
        projectId !== undefined &&
        client_email !== undefined &&
        private_key !== undefined;

      return {
        backend,
        bucket,
        options: hasCredentials
          ? {
              projectId: process.env.GCP_PROJECT_ID,
              credentials: { client_email, private_key },
            }
          : {},
      };

    default:
      throw new Error(`Unknown storage backend: ${backend}`);
  }
}

export function getStorage(): FileStorage {
  const config = getStorageConfig();

  const { backend } = config;
  switch (backend) {
    case "fs":
      return new FSStorage(config.dir);

    case "gcloud":
      const gcloud = new Storage(config.options);
      return new GcloudStorage(gcloud.bucket(config.bucket));

    default:
      throw new Error(`Unknown storage backend: ${backend}`);
  }
}
