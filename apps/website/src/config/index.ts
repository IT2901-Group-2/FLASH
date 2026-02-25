import { getStorage, getStorageConfig, StorageConfig } from "./storage";

export type Config = {
  storage: StorageConfig;
};

export function getConfig(): Config {
  return {
    storage: getStorageConfig(),
  };
}

export const storage = getStorage();
