import { Bucket, File } from "@google-cloud/storage";
import { FileStorage } from "../interface";
import { AsyncResult, Result } from "typescript-result";
import { WithImplicitCoercion } from "node:buffer";
import { dirPath, resolvePath } from "../utils";

/* eslint-disable @typescript-eslint/no-unused-vars */
export class GcloudStorage implements FileStorage {
  private bucket: Bucket;

  constructor(bucket: Bucket) {
    this.bucket = bucket;
  }

  private getFile(path: string): AsyncResult<File, Error> {
    const file = this.bucket.file(path);

    return Result.try(async () => path === "/" || file.exists().then(res => res[0])).map(
      exists =>
        exists
          ? Result.ok(file)
          : Result.error(new Error(`File or directory ${path} does not exist`))
    );
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
          .map(file => file.name.replace(new RegExp(`^${dirpath}`), ""))
          .filter(file => file !== "")
      );
  }

  read(path: string): AsyncResult<Buffer, Error> {
    return this.getFile(resolvePath(path)).mapCatching(file =>
      file.download().then(res => res[0])
    );
  }

  mkdir(path: string): AsyncResult<void, Error> {
    return Result.fromAsyncCatching(() => {
      throw new Error("Not implemented");
    });
  }

  write(
    path: string,
    data: WithImplicitCoercion<ArrayLike<number>> | string
  ): AsyncResult<void, Error> {
    return Result.fromAsyncCatching(() => {
      throw new Error("Not implemented");
    });
  }

  delete(path: string): AsyncResult<void, Error> {
    return Result.fromAsyncCatching(() => {
      throw new Error("Not implemented");
    });
  }
}
