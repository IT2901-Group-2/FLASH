import { FSStorage } from "file-storage";
import { tmpdir } from "os";
import upath from "upath";

// FIXME: Set up better config in the future
const storageDir = process.env.STORAGE_DIR ?? upath.join(tmpdir(), "foto-app");
export const storage = new FSStorage(storageDir);
