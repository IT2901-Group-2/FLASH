import { FileStorage } from "../interface";
import { absolutePath, dirPath, resolvePath } from "../utils";
import { AsyncResult, Result } from "typescript-result";
import pathlib from "path";
import fs from "fs";

export class FSStorage implements FileStorage {
  readonly dir: string;

  constructor(dir: string) {
    this.dir = dirPath(absolutePath(dir));
    fs.mkdirSync(this.dir, { recursive: true });
  }

  private resolvePath(path: string): string {
    return pathlib.join(this.dir, resolvePath(path));
  }

  list(path: string): AsyncResult<string[], Error> {
    const dirpath = this.resolvePath(path);

    return Result.try(
      () => fs.promises.readdir(dirpath, { withFileTypes: true }),
      () => new Error(`Directory ${dirpath} not found`)
    ).map(files =>
      files.map(file => (file.isDirectory() ? dirPath(file.name) : file.name))
    );
  }

  read(path: string): AsyncResult<Buffer, Error> {
    const filepath = this.resolvePath(path);

    return Result.try(
      () => fs.promises.readFile(filepath),
      () => new Error(`File ${filepath} not found`)
    );
  }

  mkdir(path: string): AsyncResult<void, Error> {
    const dirpath = this.resolvePath(path);

    return Result.try(
      () => fs.promises.mkdir(dirpath, { recursive: true }),
      () => new Error(`Couldn't create directory ${dirpath}`)
    ).map(() => Result.ok());
  }

  write(path: string, data: Buffer): AsyncResult<void, Error> {
    const filepath = this.resolvePath(path);
    const dirpath = pathlib.dirname(filepath);

    return Result.try(
      () => fs.promises.mkdir(dirpath, { recursive: true }),
      () => new Error(`Couldn't create directory ${dirpath}`)
    ).mapCatching(
      () => fs.promises.writeFile(filepath, data),
      () => new Error(`Couldn't create file ${filepath}`)
    );
  }

  delete(path: string): AsyncResult<void, Error> {
    const rPath = this.resolvePath(path);

    return Result.try(
      () => fs.promises.rm(rPath, { recursive: true }),
      () => new Error(`Couldn't delete file or directory ${rPath}`)
    );
  }
}
