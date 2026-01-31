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
    return Result.try(
      () => fs.promises.readdir(this.resolvePath(path), { withFileTypes: true }),
      () => new Error(`Directory ${path} not found`)
    ).map(files =>
      files.map(file => (file.isDirectory() ? dirPath(file.name) : file.name))
    );
  }

  read(path: string): AsyncResult<Blob, Error> {
    return Result.try(
      () => fs.promises.readFile(this.resolvePath(path)),
      () => new Error(`File ${path} not found`)
    ).map(buf => new Blob([buf]));
  }

  mkdir(path: string): AsyncResult<void, Error> {
    return Result.try(
      () => fs.promises.mkdir(this.resolvePath(path), { recursive: true }),
      () => new Error(`Couldn't create directory ${path}`)
    ).map(() => Result.ok());
  }

  write(path: string, data: Blob): AsyncResult<void, Error> {
    const filepath = this.resolvePath(path);
    const dirpath = pathlib.dirname(filepath);

    return Result.try(
      () => fs.promises.mkdir(dirpath, { recursive: true }),
      () => new Error(`Couldn't create directory ${dirpath}`)
    ).mapCatching(
      () => fs.promises.writeFile(filepath, data.stream()),
      () => new Error(`Couldn't create file ${filepath}`)
    );
  }

  delete(path: string): AsyncResult<void, Error> {
    return Result.try(
      () => fs.promises.rm(this.resolvePath(path), { recursive: true }),
      () => new Error(`Couldn't delete file or directory ${path}`)
    );
  }
}
