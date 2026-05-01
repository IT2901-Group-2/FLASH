# Website

> The core application for Flash - a self-hosted photo event sharing platform.

## Overview

This app is the heart of Flash. It serves both the user-facing frontend and the backend API from a single deployable unit, making it straightforward to self-host.

## Tech Stack

- **Framework:** Next.js / React 19
- **UI components:** `@flash/ui`
- **Design tokens:** `@flash/tokens`
- **Styling:** CSS Modules + CSS custom properties

## Getting Started

### Prerequisites

- `Node.js` >= 24
- `pnpm` >= 10.33

### Installation & Running Locally

```bash
# From repo root
pnpm install
pnpm build
pnpm --filter website dev
```

This will run the project with the defaut values for all **Environment Variables**. For setting the variables to custom values, see the [root README.md](/README.md)

## Project Structure

```
apps/website/
├── src/
│   ├── app/            # Route definitions
│   │   ├── [locale]/   # Website routes and pages
│   │   ├── api/        # The API routes
│   │   └── layout.tsx  # Root of the website
│   │
│   ├── actions/        # Server actions
│   ├── components/     # App-specific components
│   ├── config/         # Configuration files
│   ├── db/             # Database specifications and design
│   ├── hooks/          # Website specific hooks
│   ├── i18n/           # Language config files
│   ├── lib/utils/      # Utilities and helpers (for backend and API)
│   ├── providers/      # Context-providers
│   ├── services/       # Backend services
│   └── utils/          # Utils for the frontend
│
├── __mocks__/          # All mocks used in tests
├── messages/locale/    # Translation files for all text
└── public/             # Static assets
```

## Design System

This app consumes the Flash design system:

- **`@flash/ui`** - React component library. Import from the package root:

```tsx
import { Button, Card, Sidebar } from "@flash/ui";
```

- **`@flash/tokens`** - CSS custom properties for color, typography, spacing, etc.
  Must be imported at the app entry point before rendering any `@flash/ui` components:

```ts
import "@flash/tokens";
```

- **Theming** - Use `data-theme="dark"` / `.dark` for dark mode. Use `data-color="..."`
  on any element to apply a contextual color role (`primary`, `accent`, `success`, etc.).

See [`packages/tokens`](../../packages/tokens) and [`packages/ui`](../../packages/ui) for full documentation.

## Scripts

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `pnpm dev`          | Start dev server              |
| `pnpm build`        | Production build              |
| `pnpm test`         | Run tests with vitest         |
| `pnpm lint`         | ESLint (zero warnings policy) |
| `pnpm format`       | Format with Prettier          |
| `pnpm format:check` | Check format                  |
