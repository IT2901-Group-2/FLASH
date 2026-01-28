import { AwaitedResult } from "./utils";

export type FileStorage = {
  list(path: string): AwaitedResult<string[], Error>; // Returns a list of files in the directory
  read(path: string): AwaitedResult<Blob, Error>; // Returns the file contents as a Blob
  mkdir(path: string): AwaitedResult<void, Error>; // Creates a directory
  write(path: string, data: Blob): AwaitedResult<void, Error>; // Writes a Blob to file
  delete(path: string): AwaitedResult<void, Error>; // Deletes file or directory

  // TODO:
  // stream(path: string): AwaitedResult<ReadableStream, FileStorageError>; // Returns the file contents as a Stream
  // write_atomic(): AwaitedResult<void, FileStorageError>; // Writes a Blob or Stream to file atomically
};
