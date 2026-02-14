import { FileStorage } from "../interface";
import { absolutePath, dirPath, resolvePath } from "../utils";
import { AsyncResult, Result } from "typescript-result";
import upath from "upath";
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
    return upath.join(this.dir, resolvePath(path));
  }

  /**
   * Recursively creates a directory at the specified path.
   * Does not resolve the path beforehand, that should be done by the caller (see `resolvePath`).
   *
   * @param dirpath A resolved path
   * @returns An empty result
   */
  private makeDir(dirpath: string): AsyncResult<void, Error> {
    const r = Result.try(() => 1)
    return Result.try(() => fs.promises.mkdir(dirpath, { recursive: true })).map(
      Result.ok
    );
  }

  list(path: string): AsyncResult<string[], Error> {
    return Result.try(() =>
      fs.promises.readdir(this.resolvePath(path), { withFileTypes: true })
    ).map(files =>
      files.map(file => (file.isDirectory() ? dirPath(file.name) : file.name))
    );
  }

  read(path: string): AsyncResult<Buffer, Error> {
    return Result.try(() => fs.promises.readFile(this.resolvePath(path)));
  }

  mkdir(path: string): AsyncResult<void, Error> {
    return this.makeDir(this.resolvePath(path));
  }

  write(
    path: string,
    data: WithImplicitCoercion<ArrayLike<number>> | string
  ): AsyncResult<void, Error> {
    const filepath = this.resolvePath(path);

    return this.makeDir(upath.dirname(filepath)).mapCatching(() =>
      fs.promises.writeFile(filepath, Buffer.from(data))
    );
  }

  rm(path: string): AsyncResult<void, Error> {
    const filepath = this.resolvePath(path);

    return Result.try(() => fs.promises.stat(filepath))
      .map(
        stat =>
          stat.isFile() || Result.error(new Error(`File ${filepath} does not exist`))
      )
      .mapCatching(() => fs.promises.rm(filepath));
  }

  rmdir(path: string): AsyncResult<void, Error> {
    const dirpath = this.resolvePath(path);

    return Result.try(() => fs.promises.stat(dirpath))
      .map(
        stat =>
          stat.isDirectory() ||
          Result.error(new Error(`Directory ${dirpath} does not exist`))
      )
      .mapCatching(() => fs.promises.rm(dirpath, { recursive: true }));
  }
}
