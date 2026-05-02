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
Google cloud.

Additional providers can be added by implementing the generic `FileStorage`
interface (See: [Adding a backend](#adding-a-backend)).

### Local file system

...

### Google cloud storage

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

Interface overview ...

## Development

### Testing

Tests are run with `pnpm test` (bla bla bla)

...

### Adding a backend

...
