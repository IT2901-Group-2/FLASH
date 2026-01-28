import { Err, Ok, Result } from "ts-results";
import { FileStorage } from "./fileStorage";
import { absolutePath, dirPath } from "./utils";
import fs from "fs/promises";

export class FSStorage implements FileStorage {
  readonly dir: string;

  constructor(dir: string) {
    this.dir = dirPath(absolutePath(dir));
  }

  async list(path: string): Promise<Result<string[], Error>> {
    return fs
      .readdir(absolutePath(this.dir, path))
      .then(Ok<string[]>)
      .catch(() => Err(new Error(`Directory ${path} not found`)));
  }

  async read(path: string): Promise<Result<Blob, Error>> {
    return fs
      .readFile(absolutePath(this.dir, path))
      .then(buf => Ok(new Blob([buf])))
      .catch(() => Err(new Error(`File ${path} not found`)));
  }

  async mkdir(path: string): Promise<Result<void, Error>> {
    return fs
      .mkdir(absolutePath(this.dir, path))
      .then(() => Ok.EMPTY)
      .catch(() => Err(new Error(`Couldn't create directory ${path}`)));
  }

  async write(path: string, data: Blob): Promise<Result<void, Error>> {
    return fs
      .writeFile(absolutePath(this.dir, path), data.stream())
      .then(() => Ok.EMPTY)
      .catch(() => Err(new Error(`Couldn't create file ${path}`)));
  }

  async delete(path: string): Promise<Result<void, Error>> {
    return fs
      .rm(absolutePath(this.dir, path))
      .then(() => Ok.EMPTY)
      .catch(() => Err(new Error(`Couldn't delete file or directory ${path}`)));
  }
}
