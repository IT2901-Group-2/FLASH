import { Bucket } from "@google-cloud/storage";
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

  list(path: string): AsyncResult<string[], Error> {
    const dirpath = dirPath(resolvePath(path)).replace(/^\//, "");

    return Result.try(async () => {
      if (dirpath === "") {
        return;
      }

      const [exists] = await this.bucket.file(dirpath).exists();
      if (!exists) {
        throw new Error(`Directory ${dirpath} does not exist`);
      }
    })
      .mapCatching(() =>
        this.bucket.getFiles({
          prefix: dirpath,
          delimiter: "/",
          includeTrailingDelimiter: true,
        })
      )
      .map(res => res[0])
      .map(files =>
        files
          .map(file => file.name.replace(new RegExp(`^${dirpath}`), ""))
          .filter(file => file !== "")
      );
  }

  read(path: string): AsyncResult<Buffer, Error> {
    return Result.fromAsyncCatching(() => {
      throw new Error("Not implemented");
    });
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
