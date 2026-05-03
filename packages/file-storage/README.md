# @flash/file-storage

A unified abstraction layer for interacting with persistent file storage. This
package provides a consistent interface across different storage
providers/solutions, making it easy to switch between them without any changes
to storage-dependent code.

The goal for this package was to provide a generic file storage solution for
FLASH without locking us in to one specific provider. It also made it easier to
develop and test our application across changing storage environments.

## Supported backends

Currently, the package supports saving files on the local file system and in
Google Cloud Storage.

Additional providers can be added by implementing the generic `FileStorage`
interface (See: [Adding a backend](#adding-a-backend)).

### Local file system

```ts
class FSStorage implements FileStorage {
  constructor(dir: string) {
    // ...
  }
}
```

The [`FSStorage`](./src/implementations/fsStorage.ts) class implements local
file storage using Node.js' [`node:fs`] module. The constructor takes a path to
the local directory to be used as root for the initialized `FSStorage` instance.
If the provided directory does not exist, it will be created.

All file storage interactions through an
[`FSStorage`](./src/implementations/fsStorage.ts) instance will be constrained
to the provided root directory.

### Google Cloud Storage

```ts
class GcloudStorage implements FileStorage {
  constructor(bucket: Bucket) {
    // ...
  }
```

The [`GcloudStorage`](./src/implementations/gcloudStorage.ts) class interfaces
with Google Cloud Storage using Google's own
[`@google-cloud/storage`](www.npmjs.com/package/@google-cloud/storage) npm
package. The constructor takes a `Bucket` instance from `@google-cloud/storage`
which will be used to read from / write to.

## Installation

To use this package within the monorepo, add it to the desired `package.json`
dependencies, like so:

```json
{
  "dependencies": {
    "@flash/file-storage": "workspace:*"
  }
}
```

## Usage

The generic `FileStorage` interface defines 6 methods for interacting with file
storage solutions. All of which should be kept consistent across all concrete
implementations.

All of the public methods return an `AsyncResult` instance from
[`typescript-results`](https://www.typescript-result.dev/) which propagetes the
actual `Error` instance thrown on error.

### [list](./src/interface.ts#L26)

```ts
FileStorage.list(path: string): AsyncResult<string[], Error>;
```

Returns a list of all the file and directory names in the directory at the given
`path`. All directory names end with a `/`.

The parameter `path` must be a valid path to a directory.

### [read](./src/interface.ts#L40)

```ts
FileStorage.read(path: string): AsyncResult<Buffer, Error>;
```

Returns the contents of the file at the given `path` as a `Buffer`.

The parameter `path` must be a valid path to a file.

### [mkdir](./src/interface.ts#L53)

```ts
FileStorage.mkdir(path: string): AsyncResult<void, Error>;
```

Creates a new directory at the specified `path`. If directory already exists,
does nothing.

### [write](./src/interface.ts#L69)

```ts
FileStorage.write(
  path: string,
  data: WithImplicitCoercion<ArrayLike<number>> | string
): AsyncResult<void, Error>;
```

Creates a new file at the given `path` and writes the given `data` to it. If the
file already exists it will be overwritten.

The paramater `path` must be a valid path to a file. The parameter `data`
accepts anything that can be passed to `Buffer.from`.

### [rm](./src/interface.ts#L95)

```ts
FileStorage.rm(path: string): AsyncResult<void, Error>;
```

Deletes the file at the given `path`.

The parameter `path` must be a valid path to a file.

### [rmdir](./src/interface.ts#L119)

```ts
FileStorage.rmdir(path: string): AsyncResult<void, Error>;
```

Deletes the directory at the given `path`. All of the directories contents will
be recursively deleted as well.

The parameter `path` must be a valid path to a directory.

## Development

### Requirements

- Node.js 20+
- Pnpm 10+

All other dependencies can be installed by running the following command in this
directory.

```bash
pnpm install
```

### Testing

[Unit tests](./src/implementations/__tests__) are implemented for each
`FileStorage` implementation using [`jest`](https://jestjs.io/). To run all the
tests use the following command.

```bash
pnpm test
```

### Adding a backend

...
