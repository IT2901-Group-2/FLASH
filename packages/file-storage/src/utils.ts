import pathlib from "path";

export function resolvePath(...paths: string[]): string {
  return pathlib.resolve("/", ...paths).replace(/^\/(.+)/, "$1");
}

export function absolutePath(...paths: string[]): string {
  return resolvePath(...paths).replace(/^([^\/])/, "/$1");
}

export function dirPath(path: string): string {
  return path.replace(/([^\/])$/, "$1/");
}

export function isRoot(filepath: string): boolean {
  return resolvePath(filepath) === "/";
}
