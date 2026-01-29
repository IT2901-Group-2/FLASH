import { AwaitedResult } from "./utils";

export type FileStorage = {
  list(path: string): AwaitedResult<string[], string>; // Returns a list of files in the directory
  read(path: string): AwaitedResult<Blob, string>; // Returns the file contents as a Blob
  mkdir(path: string): AwaitedResult<void, string>; // Creates a directory
  write(path: string, data: Blob): AwaitedResult<void, string>; // Writes a Blob to file
  delete(path: string): AwaitedResult<void, string>; // Deletes file or directory
};
