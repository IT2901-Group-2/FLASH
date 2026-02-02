import upath from "upath";

const ROOT = upath.resolve("/");

/**
 * Resolves a path as if it were a path from root and then removes the leading `/`.
 *
 * @example
 * ```typescript
 * resolvePath("/foo/bar"); // -> "foo/bar"
 * resolvePath("foo/bar/../baz"); // -> "foo/baz"
 * resolvePath("../../foo"); // -> "foo"
 * ```
 *
 * @param paths The path to resolve
 * @returns The resolved path
 */
export function resolvePath(...paths: string[]): string {
  return upath
    .resolve(ROOT, ...paths)
    .replace(/^\/(.+)/, "$1")
    .replace(new RegExp(`^${ROOT}`), "/");
}

/**
 * Resolves the path as if it were a path from root, and adds a leading `/` if neccessary.
 *
 * @example
 * ```typescript
 * absolutePath("/foo/bar"); // -> "/foo/bar"
 * absolutePath("foo/bar/../baz"); // -> "/foo/baz"
 * absolutePath("../../foo"); // -> "/foo"
 * ```
 *
 * @param paths The path to resolve
 * @returns The resolved path
 */
export function absolutePath(...paths: string[]): string {
  return resolvePath(...paths).replace(/^([^/])/, "/$1");
}

/**
 * Appends a `/` to the end of the path if neccessary.
 *
 * @example
 * ```typescript
 * dirPath("foo"); // -> "foo/"
 * dirPath("foo/"); // -> "foo/"
 * dirPath("foo/bar"); // "foo/bar/"
 * dirPath("foo/bar/"); // -> "foo/bar/"
 * ```
 *
 * @param path A path
 * @returns A path with a trailing `/`
 */
export function dirPath(path: string): string {
  return path.replace(/([^/])$/, "$1/");
}
