import { Result } from "ts-results";

export enum FileStorageError {
  NOT_FOUND = "File or directory was not found",
}

export enum Filetype {
  FILE,
  DIR,
}

export type File = {
  type: Filetype.FILE;
  path: string;
};

export type Directory = {
  type: Filetype.DIR;
  path: string;
};

export type FileStorageEntry = (File | Directory) & {
  isFile(): this is File;
  isDir(): this is Directory;
};

export type FileStorage = {
  stat(path: string): Promise<Result<FileStorageEntry, FileStorageError>>; // Returns file metadata
  list(path: string): Promise<Result<FileStorageEntry[], FileStorageError>>; // Returns a list of files in the directory
  read(path: string): Promise<Result<Blob, FileStorageError>>; // Returns the file contents as a Blob
  // stream(path: string): Promise<Result<ReadableStream, FileStorageError>>; // Returns the file contents as a Stream
  mkdir(paht: string): Promise<Result<void, FileStorageError>>; // Creates a directory
  write(): Promise<Result<void, FileStorageError>>; // Writes a Blob or Stream to file
  // write_atomic(): Promise<Result<void, FileStorageError>>; // Writes a Blob or Stream to file atomically
};
