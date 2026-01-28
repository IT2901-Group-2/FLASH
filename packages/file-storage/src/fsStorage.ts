import { Err, Ok } from "ts-results";
import { FileStorage } from "./fileStorage";
import { absolutePath, awaited, AwaitedResult, dirPath } from "./utils";
import fs from "fs/promises";

export class FSStorage implements FileStorage {
  readonly dir: string;

  constructor(dir: string) {
    this.dir = dirPath(absolutePath(dir));
  }

  list(path: string): AwaitedResult<string[], Error> {
    return awaited(
      fs
        .readdir(absolutePath(this.dir, path))
        .then(Ok<string[]>)
        .catch(() => Err(new Error(`Directory ${path} not found`)))
    );
  }

  read(path: string): AwaitedResult<Blob, Error> {
    return awaited(
      fs
        .readFile(absolutePath(this.dir, path))
        .then(buf => Ok(new Blob([buf])))
        .catch(() => Err(new Error(`File ${path} not found`)))
    );
  }

  mkdir(path: string): AwaitedResult<void, Error> {
    return awaited(
      fs
        .mkdir(absolutePath(this.dir, path))
        .then(() => Ok.EMPTY)
        .catch(() => Err(new Error(`Couldn't create directory ${path}`)))
    );
  }

  write(path: string, data: Blob): AwaitedResult<void, Error> {
    return awaited(
      fs
        .writeFile(absolutePath(this.dir, path), data.stream())
        .then(() => Ok.EMPTY)
        .catch(() => Err(new Error(`Couldn't create file ${path}`)))
    );
  }

  delete(path: string): AwaitedResult<void, Error> {
    return awaited(
      fs
        .rm(absolutePath(this.dir, path))
        .then(() => Ok.EMPTY)
        .catch(() => Err(new Error(`Couldn't delete file or directory ${path}`)))
    );
  }
}
