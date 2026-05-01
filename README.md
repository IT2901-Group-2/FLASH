<div align="center">

![alt text](.github/images/header.png)

</div>

<div align="center">

![License](https://img.shields.io/github/license/IT2901-Group-2/FLASH)
![Issues](https://img.shields.io/github/issues/IT2901-Group-2/FLASH)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Last Commit](https://img.shields.io/github/last-commit/IT2901-Group-2/FLASH)

</div>

<div align="center">

![NTNU IT2901](https://img.shields.io/badge/NTNU-IT2901-blue)

</div>

## Table of Contents

## Overview

### Key Features

## Architecture

### Monorepo Structure

### Tech Stack

## Getting Started

### Prerequisites

### Installation

### Environment Variables

| Variable | Description | Default Value | Required |
| -------- | ----------- | ------------- | -------- |
| `...`    | ...         |               | Yes      |

## Running the App

### Development

### Production (Docker)

### Tests

FLASH includes a comprehensive test suite and a mix of testing strategies across its packages to ensure reliability and correctness across all components.

#### Test Overview

| Package          | Unit | Accessibility | Interaction | E2E |
| ---------------- | ---- | ------------- | ----------- | --- |
| **Website**      | ✓    |               |             | ✓   |
| **file-storage** | ✓    |               |             |     |
| **tokens**       | ✓    |               |             |     |
| **UI**           | ✓    | ✓             | ✓           |     |

#### Running Tests

To run all **unit** tests across all packages and the website, run

```bash
pnpm test                       # For all unit tests
pnpm --filter <workspace> test  # To run unit test for a specific workspace
```

To run **End-to-End** (E2E) tests for the `apps/website`, run

```bash
pnpm test:e2e
```

For storybook, the `test` command only runs the unit and interaction tests. For visual and accessibility tests, start Storybook and use the UI to run the tests.

```bash
pnpm storybook
```

## Usage

_**ADD THE VIDEO HERE**_

## Additional documentation

There is additional documentation in README.md files for each app and package in the monorepo. The links to them is bellow.

**Apps**

- [Website](./apps/website/README.md)

**Packages**

- [File-Storage](./packages/file-storage/README.md)
- [Tokens](./packages/tokens/README.md)
- [UI](./packages/ui/README.md)
