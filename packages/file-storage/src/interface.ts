import { AsyncResult } from "typescript-result";

export type FileStorage = {
  list(path: string): AsyncResult<string[], Error>; // Returns a list of files in the directory
  read(path: string): AsyncResult<Blob, Error>; // Returns the file contents as a Blob
  mkdir(path: string): AsyncResult<void, Error>; // Creates a directory
  write(path: string, data: Blob): AsyncResult<void, Error>; // Writes a Blob to file
  delete(path: string): AsyncResult<void, Error>; // Deletes file or directory
};
