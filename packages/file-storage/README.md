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

...

### Google Cloud Storage

...

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

The generic `FileStorage` interface defines 6 methods for interacting with a
file storage solution. All of which should be kept consistent across all
concrete implementations.

File path resolution ...

All of the public methods return an `AsyncResult` instance from
[`typescript-results`](https://www.typescript-result.dev/).

### list

```ts
FileStorage.list(path: string): AsyncResult<string[], Error>;
```

[temp link](./src/interface.ts#L26)

Returns a list of all the filenames of all files in the given directory. The
parameter `path` must be a valid path to a directory, otherwise this method will
fail.

### read

```ts
FileStorage.read(path: string): AsyncResult<Buffer, Error>;
```

### mkdir

```ts
FileStorage.mkdir(path: string): AsyncResult<void, Error>;
```

### write

```ts
FileStorage.write(
  path: string,
  data: WithImplicitCoercion<ArrayLike<number>> | string
): AsyncResult<void, Error>;
```

### rm

```ts
FileStorage.rm(path: string): AsyncResult<void, Error>;
```

### rmdir

```ts
FileStorage.rmdir(path: string): AsyncResult<void, Error>;
```

## Development

### Testing

Tests are run with `pnpm test` (bla bla bla)

...

### Adding a backend

...
