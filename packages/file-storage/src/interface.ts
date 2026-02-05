import { WithImplicitCoercion } from "buffer";
import { AsyncResult } from "typescript-result";

/**
 * Generic file storage interface.
 */
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
  read(path: string): AsyncResult<Buffer, Error>;

  /**
   * Creates an empty directory. Does nothing if the directory already exists.
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
   * await fileStorage.write("foo.txt", "some data").getOrThrow();
   * ```
   *
   * @param path The path to the file
   * @param data The data to write to the file
   * @returns An empty result
   */
  write(
    path: string,
    data: WithImplicitCoercion<ArrayLike<number>> | string
  ): AsyncResult<void, Error>;

  /**
   * Deletes a file. Throws an error if file does not exist.
   *
   * @example
   * ```typescript
   * // foo
   * // ├── bar
   * // │   └── file2.txt
   * // ├── baz/
   * // └── file1.txt
   *
   * // Deletes `foo/file1.txt`
   * await fileStorage.rm("foo/file1.txt").getOrThrow();
   *
   * // Deletes `foo/bar/file2.txt`
   * await fileStorage.rm("foo/bar/file2.txt").getOrThrow();
   * ```
   *
   * @param path The path to the file
   * @returns An empty result
   */
  rm(path: string): AsyncResult<void, Error>;

  /**
   * Recursively deletes a directory and its contents.
   * Throws an error if directory does not exist.
   *
   * @example
   * ```typescript
   * // foo
   * // ├── bar
   * // │   └── file3.txt
   * // ├── baz/
   * // └── file1.txt
   *
   * // Deletes `foo/baz/`
   * await fileStorage.rm("foo/baz").getOrThrow();
   *
   * // Deletes `foo/bar/` and `foo/bar/file3.txt`
   * await fileStorage.rm("foo/bar").getOrThrow();
   * ```
   *
   * @param path The path to the file
   * @returns An empty result
   */
  rmdir(path: string): AsyncResult<void, Error>;
}
