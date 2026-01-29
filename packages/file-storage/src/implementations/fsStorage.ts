import { Err, Ok } from "ts-results";
import { FileStorage } from "../interface";
import { absolutePath, awaited, AwaitedResult, dirPath, resolvePath } from "../utils";
import pathlib from "path";
import fs from "fs";

export class FSStorage implements FileStorage {
  readonly dir: string;

  constructor(dir: string) {
    this.dir = dirPath(absolutePath(dir));
    fs.mkdirSync(this.dir, { recursive: true });
  }

  private resolvePath(path: string): string {
    return pathlib.join(this.dir, resolvePath(path));
  }

  list(path: string): AwaitedResult<string[], string> {
    return awaited(
      fs.promises
        .readdir(this.resolvePath(path), { withFileTypes: true })
        .then(files =>
          files.map(file => (file.isDirectory() ? dirPath(file.name) : file.name))
        )
        .then(Ok<string[]>)
        .catch(() => Err(`Directory ${path} not found`))
    );
  }

  read(path: string): AwaitedResult<Blob, string> {
    return awaited(
      fs.promises
        .readFile(this.resolvePath(path))
        .then(buf => Ok(new Blob([buf])))
        .catch(() => Err(`File ${path} not found`))
    );
  }

  mkdir(path: string): AwaitedResult<void, string> {
    return awaited(
      fs.promises
        .mkdir(this.resolvePath(path), { recursive: true })
        .then(() => Ok.EMPTY)
        .catch(() => Err(`Couldn't create directory ${path}`))
    );
  }

  write(path: string, data: Blob): AwaitedResult<void, string> {
    const filepath = this.resolvePath(path);
    return awaited(
      fs.promises
        .mkdir(pathlib.dirname(filepath), { recursive: true })
        .then(() => fs.promises.writeFile(filepath, data.stream()))
        .then(() => Ok.EMPTY)
        .catch(() => Err(`Couldn't create file ${path}`))
    );
  }

  delete(path: string): AwaitedResult<void, string> {
    return awaited(
      fs.promises
        .rm(absolutePath(this.dir, path), { recursive: true })
        .then(() => Ok.EMPTY)
        .catch(() => Err(`Couldn't delete file or directory ${path}`))
    );
  }
}
