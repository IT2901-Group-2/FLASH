import { Bucket, File } from "@google-cloud/storage";
import { FileStorage } from "../interface";
import { AsyncResult, Result } from "typescript-result";
import { WithImplicitCoercion } from "node:buffer";
import { dirPath, resolvePath } from "../utils";
import upath from "upath";

export class GcloudStorage implements FileStorage {
  private bucket: Bucket;

  constructor(bucket: Bucket) {
    this.bucket = bucket;
  }

  /**
   * Returns a `@google-cloud/storage` `File` instance to a file in the bucket.
   * Returns an error if the file does not exist at the specified path.
   * Does not resolve the path beforehand, that should be done by the caller.
   *
   * @param path A resolved path
   * @returns A result with the `File` instance or an Error on failure
   */
  private getFile(path: string): AsyncResult<File, Error> {
    const file = this.bucket.file(path);

    return Result.try(async () => path === "/" || file.exists().then(res => res[0])).map(
      exists =>
        exists
          ? Result.ok(file)
          : Result.error(new Error(`File or directory ${path} does not exist`))
    );
  }

  /**
   * Recursively creates a directory at the specified path.
   * Does not resolve the path beforehand, that should be done by the caller.
   * Will append a trailing `/` to the path if not already present.
   *
   * @param path A resolved path
   * @returns An empty result
   */
  private makeDir(path: string): AsyncResult<void, Error> {
    const dirpath = dirPath(path);

    return Result.fromAsyncCatching(
      Promise.all(
        dirpath
          .matchAll(/\//g)
          .map(({ index }) => dirpath.slice(0, index + 1))
          .map(dir => this.bucket.file(dir).save(""))
      )
    ).map(Result.ok);
  }

  list(path: string): AsyncResult<string[], Error> {
    const dirpath = dirPath(resolvePath(path));

    return this.getFile(dirpath)
      .mapCatching(() =>
        this.bucket.getFiles({
          prefix: dirpath,
          delimiter: "/",
          includeTrailingDelimiter: true,
        })
      )
      .map(([files]) =>
        files
          .filter(file => file.name !== dirpath)
          .map(file => file.name.slice(dirpath.length))
      );
  }

  read(path: string): AsyncResult<Buffer, Error> {
    return this.getFile(resolvePath(path)).mapCatching(file =>
      file.download().then(res => res[0])
    );
  }

  mkdir(path: string): AsyncResult<void, Error> {
    return this.makeDir(resolvePath(path));
  }

  write(
    path: string,
    data: WithImplicitCoercion<ArrayLike<number>> | string
  ): AsyncResult<void, Error> {
    const filepath = resolvePath(path);

    return this.makeDir(upath.dirname(filepath)).mapCatching(() =>
      this.bucket.file(filepath).save(Buffer.from(data))
    );
  }

  rm(path: string): AsyncResult<void, Error> {
    return this.getFile(resolvePath(path)).mapCatching(file => file.delete());
  }

  rmdir(path: string): AsyncResult<void, Error> {
    const dirpath = dirPath(resolvePath(path));

    return this.getFile(dirpath)
      .mapCatching(() => this.bucket.getFiles({ prefix: dirpath }))
      .mapCatching(([files]) => Promise.all(files.map(file => file.delete())));
  }
}
