import { FileStorage } from "../interface";
import { absolutePath, dirPath, resolvePath } from "../utils";
import { AsyncResult, Result } from "typescript-result";
import pathlib from "path";
import fs from "fs";
import { WithImplicitCoercion } from "buffer";

export class FSStorage implements FileStorage {
  private dir: string;

  constructor(dir: string) {
    this.dir = dirPath(absolutePath(dir));
    fs.mkdirSync(this.dir, { recursive: true });
  }

  /**
   * Converts the provided path into a consistent internal representation.
   *
   * @example
   * ```
   * // this.dir = "/foo"
   * this.resolvePath("bar/baz.txt") // -> "/foo/bar/baz.txt"
   * this.resolvePath("bar/dir/../baz.txt") // -> "/foo/bar/baz.txt"
   * this.resolvePath("bar") // -> "/foo/bar/"
   * ```
   * @param path An arbitrary path
   * @returns A resolved path
   */
  private resolvePath(path: string): string {
    return pathlib.join(this.dir, resolvePath(path));
  }

  /**
   * Recursively creates a directory at the specified path.
   * Does not resolve the path beforehand, that should be done by the caller (see `resolvePath`).
   *
   * @param dirpath A resolved path
   * @returns An empty result
   */
  private makeDir(dirpath: string): AsyncResult<void, Error> {
    return Result.try(
      () => fs.promises.mkdir(dirpath, { recursive: true }),
      () => new Error(`Couldn't create directory ${dirpath}`)
    ).map(Result.ok);
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
    return this.makeDir(this.resolvePath(path));
  }

  write(
    path: string,
    data: WithImplicitCoercion<ArrayLike<number>> | string
  ): AsyncResult<void, Error> {
    const filepath = this.resolvePath(path);

    return this.makeDir(pathlib.dirname(filepath)).mapCatching(
      () => fs.promises.writeFile(filepath, Buffer.from(data)),
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
