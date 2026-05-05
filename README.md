<div align="center">

![Logo header](.github/media/header.png)

</div>

<div align="center">

![License](https://img.shields.io/github/license/IT2901-Group-2/FLASH?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/IT2901-Group-2/FLASH?style=for-the-badge)
![TypeScript](https://img.shields.io/github/actions/workflow/status/IT2901-Group-2/FLASH/ci.yaml?branch=main&style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/IT2901-Group-2/FLASH?style=for-the-badge)

</div>

<div align="center">

![NTNU IT2901](https://img.shields.io/badge/NTNU-IT2901-red?style=for-the-badge)

</div>

## Table of Contents

- [Overview](#overview)
  - [Key Features](#key-features)
- [Architecture](#architecture)
  - [Monorepo Structure](#monorepo-structure)
  - [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#development)
  - [Requirements](#requirements)
  - [Tests](#tests)
    - [Test Overview](#test-overview)
    - [Running Tests](#running-tests)
  - [Running the Application](#running-the-application)

## Overview

### Key Features

## Architecture

### Monorepo Structure

This project uses a monorepo structure. The different parts of the monorepo and
their functionality is:

| Package                                                 | Description                                                                            |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [**`website`**](./apps/website/README.md)               | The heart of `FLASH`. Contains both the user-facing frontend and the backend API.      |
| [**`file-storage`**](./packages/file-storage/README.md) | The file management logic for `FLASH`. Manages support for multiple storage solutions. |
| [**`tokens`**](./packages/tokens/README.md)             | A TypeScript-first CSS design token system.                                            |
| [**`UI`**](./packages/ui/README.md)                     | The component library for the Flash design system.                                     |

### Tech Stack

## Getting Started

### Prerequisites

### Installation

### Environment Variables

| Variable                    | Default Value          | Description                                                                                                        |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ADMIN_PASSWORD`            | `"Default"`            | The administrator password to use.                                                                                 |
| `TOAST_DISPLAY_TIME`        | `5000` (5 seconds)     | The amount of time in milliseconds notification toasts stay on screen for.                                         |
| `MULTI_FILE_UPLOAD`         | `false`                | Whether or not to allow users to upload multiple images at once. `"true"` and `"1"` are accepted as truthy values. |
| `SLIDESHOW_SLIDE_DURATION`  | `10000` (10 seconds)   | The amount of time in milliseconds before progressing to the next slide on the slideshow.                          |
| `MAX_IMAGE_SIZE`            | `12582912` (12 MiB)    | The maximum image size in bytes that the user is allowed to upload.                                                |
| `EVENT_REFETCH_INTERVAL`    | `120000` (120 seconds) | ...                                                                                                                |
| `PHOTOS_REFETCH_INTERVAL`   | `12000`                | ...                                                                                                                |
| `JWT_SECRET`                | `"SUPER_SECRET_KEY"`   | The secret key to use for JWT token encryption/decryption. Keep this private.                                      |
| `STORAGE_BACKEND`           | `"fs"`                 | Which storage backend to use. Currently one of `"fs"` or `"gcloud"`                                                |
| `STORAGE_DIR`               | `$tmp/flash`           |                                                                                                                    |
| `GCP_BUCKET`                | -                      |                                                                                                                    |
| `GCP_PROJECT_ID`            | -                      |                                                                                                                    |
| `GCP_SERVICE_ACCOUNT_EMAIL` | -                      |                                                                                                                    |
| `GCP_PRIVATE_KEY`           | -                      |                                                                                                                    |

## Development

### Requirements

- Node.js 20+
- Pnpm 10+

Project dependencies can be installed by running the following command:

```bash
pnpm install
```

Before the application or any tests can be run the local monorepo packages have
to be built with the following command:

```bash
pnpm build:packages
```

In order to run end to end tests Playwright browsers need to be installed as
well. This can be done like so:

```bash
pnpm --filter website exec playwright install
```

### Tests

FLASH includes a comprehensive test suite and a mix of testing strategies across
its packages to ensure reliability and correctness across all parts of the
application.

#### Test Overview

| Package            | Unit | Accessibility | Interaction | E2E |
| ------------------ | ---- | ------------- | ----------- | --- |
| **`Website`**      | ✓    |               |             | ✓   |
| **`file-storage`** | ✓    |               |             |     |
| **`tokens`**       | ✓    |               |             |     |
| **`UI`**           | ✓    | ✓             | ✓           |     |

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

For storybook, the `test` command only runs the unit and interaction tests. For
visual and accessibility tests, start Storybook and use the UI to run the tests.

```bash
pnpm storybook
```

### Running the Application

After installing the dependencies and building the packages, you can start the
main application in development mode using this command:

```shell
pnpm dev
```

This will start a Next.js development server which compiles pages on-demand only
when accessed and automatically rebuilds pages when the code changes.

The application can also be built locally and started in production mode.

```bash
pnpm build # Builds every package along with the main application
# or
pnpm --filter website build # Builds only the main application (useful if you have run `pnpm build:packages` already)

pnpm start # Starts the production server
```
