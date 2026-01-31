import { Bucket } from "@google-cloud/storage";
import { FileStorage } from "../interface";
import { AsyncResult, Result } from "typescript-result";
import { WithImplicitCoercion } from "node:buffer";

export class GcloudStorage implements FileStorage {
  private bucket: Bucket;

  constructor(bucket: Bucket) {
    this.bucket = bucket;
  }

  list(path: string): AsyncResult<string[], Error> {
    return Result.fromAsyncCatching(() => {
      throw new Error("Not implemented");
    });
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
