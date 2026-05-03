<div align="center">

![alt text](.github/media/header.png)

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
- [Running the App](#running-the-app)
  - [Development](#development)
  - [Production (Docker)](#production-docker)
  - [Tests](#tests)
    - [Test Overview](#test-overview)
    - [Running Tests](#running-tests)
- [Usage](#usage)
- [Additional Documentation](#additional-documentation)

## Overview

### Key Features

## Architecture

### Monorepo Structure

This project uses a monorepo structure. The different parts of the monorepo and their functionality is:

| Package            | Description                                                                      |
| ------------------ | -------------------------------------------------------------------------------- |
| **`website`**      | The heart of `FLASH`. Contains both the user-facing frontend and the backend API |
| **`file-storage`** | The file management logic for `FLASH`. Supprots multiple storage solutions       |
| **`tokens`**       | A TypeScript-first CSS design token system                                       |
| **`UI`**           | The component library for the Flash design system                                |

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

FLASH includes a comprehensive test suite and a mix of testing strategies across its packages to ensure reliability and correctness across all parts of the application.

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

For storybook, the `test` command only runs the unit and interaction tests. For visual and accessibility tests, start Storybook and use the UI to run the tests.

```bash
pnpm storybook
```

## Usage

## Additional documentation

There is additional documentation in README.md files for each app and package in the monorepo. The links to them is bellow.

**Apps**

- [Website](./apps/website/README.md)

**Packages**

- [File-Storage](./packages/file-storage/README.md)
- [Tokens](./packages/tokens/README.md)
- [UI](./packages/ui/README.md)
