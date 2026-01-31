import { AsyncResult } from "typescript-result";

export interface FileStorage {
  /**
   * Lists the filenames of all files in a directory (not recursively). All directories end with `/`.
   *
   * @example
   * ```typescript
   * // foo
   * // ├── bar
   * // │   └── file3.txt
   * // ├── file1.txt
   * // └── file2
   *
   * await fileStorage.list("foo").getOrThrow(); // ["bar/", "file1.txt", "file2"]
   *
   * ```
   *
   * @param path The path to the directory
   * @returns A result containing the list of files in the directory
   */
  list(path: string): AsyncResult<string[], Error>;

  /**
   * Reads the contents of a file.
   *
   * @example
   * ```typescript
   * // Reads the contents of the file `foo.txt`
   * await fileStorage.read("foo.txt").getOrThrow();
   * ```
   *
   * @param path The path to the file
   * @returns A result containing the contents of the file
   */
  read(path: string): AsyncResult<Blob, Error>;

  /**
   * Creates an empty directory.
   *
   * @example
   * ```typescript
   * // Creates the directory `foo/`
   * await fileStorage.mkdir("foo").getOrThrow();
   * ```
   * @param path The path to the directory
   * @returns An empty result
   */
  mkdir(path: string): AsyncResult<void, Error>;

  /**
   * Writes data to file, creating it if it does not already exist.
   * If the file exists it will be overwritten.
   *
   * @example
   * ```typescript
   * // Creates the file `foo.txt` and writes "some data" to it
   * await fileStorage.write("foo.txt", new Blob(["some data"])).getOrThrow();
   * ```
   *
   * @param path The path to the file
   * @param data The data to write to the file
   * @returns An empty result
   */
  write(path: string, data: Blob): AsyncResult<void, Error>;

  /**
   * Recursively deletes a file or directory.
   *
   * @example
   * ```typescript
   * // foo
   * // ├── bar
   * // │   └── file3.txt
   * // ├── file1.txt
   * // └── file2
   *
   * // Deletes `foo/file2`
   * await fileStorage.rm("foo/file2").getOrThrow();
   *
   * // Deletes `foo/bar/` and `foo/bar/file3.txt`
   * await fileStorage.rm("foo/bar").getOrThrow();
   *
   * ```
   *
   * @param path The path to the file or directory
   * @returns An empty result
   */
  delete(path: string): AsyncResult<void, Error>;
}
