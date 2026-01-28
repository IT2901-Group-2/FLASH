import { Err, Ok, Result } from "ts-results";
import {
  Directory,
  File,
  FileStorage,
  FileStorageEntry,
  FileStorageError,
  Filetype,
} from "./fileStorage";
import pathlib from "path";
import fs from "fs/promises";

export class FSStorage implements FileStorage {
  readonly dir: string;

  constructor(dir: string) {
    this.dir = pathlib.resolve(dir);
  }

  async stat(path: string): Promise<Result<FileStorageEntry, FileStorageError>> {
    const stat = await fs.stat(path);
    if (!stat.isFile() && !stat.isDirectory()) {
      return Err(FileStorageError.NOT_FOUND);
    }

    return stat.isFile()
      ? Ok({
          type: Filetype.FILE,
          path,
          isFile: (() => true) as () => this is File,
          isDir: (() => false) as () => this is Directory,
        })
      : Ok({
          type: Filetype.DIR,
          path,
          isFile: (() => false) as () => this is File,
          isDir: (() => true) as () => this is Directory,
        });
  }

  async list(path: string): Promise<Result<FileStorageEntry[], FileStorageError>> {
    return null as never;
  }

  async read(path: string): Promise<Result<Blob, FileStorageError>> {
    return null as never;
  }

  async mkdir(paht: string): Promise<Result<void, FileStorageError>> {
    return null as never;
  }

  async write(): Promise<Result<void, FileStorageError>> {
    return null as never;
  }
}
