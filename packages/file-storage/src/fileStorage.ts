import { Result } from "ts-results";

export type FileStorage = {
  list(path: string): Promise<Result<string[], Error>>; // Returns a list of files in the directory
  read(path: string): Promise<Result<Blob, Error>>; // Returns the file contents as a Blob
  mkdir(path: string): Promise<Result<void, Error>>; // Creates a directory
  write(path: string, content: Blob): Promise<Result<void, Error>>; // Writes a Blob to file

  // TODO:
  // stream(path: string): Promise<Result<ReadableStream, FileStorageError>>; // Returns the file contents as a Stream
  // write_atomic(): Promise<Result<void, FileStorageError>>; // Writes a Blob or Stream to file atomically
};
