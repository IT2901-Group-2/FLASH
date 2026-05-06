# @flash/tokens

A TypeScript-first CSS design token system for FLASH. The single source of thruth for color, typography, spacing and more. Suports light/dark themes, semantic color roles, and `data-color` contextual theming.

---

## Usage

### CSS (recommended)

Import the full pre-built token bundle directly in your CSS or entry file:

```css
@import "@flash/tokens";
```

Or import it in your JavaScript/TypeScript entry point:

```ts
import "@flash/tokens/tokens";
```

This injects all CSS custom properties for both light and dark themes, semantic color roles, typography, radius, shadow, opacity, and breakpoints.

---

### JavaScript / TypeScript

Import tokens as typed JS constants:

```ts
import { ColorNeutralBase } from "@flash/tokens/js";

console.log(ColorNeutralBase); // "#828284"
```

TypeScript types are included automatically via the `./js` export.

---

### Token Documentation

A structured documentation object is available for building tooling, storybooks, or token explorers:

```ts
import tokenDocs from "@flash/tokens/token_docs";
```

---

### CSS Reset

A baseline CSS reset is also included:

```css
@import "@flash/tokens/css/reset.css";
```

---

## Token Categories

### Overview

| Color      | Prefix (css)    | Example                               |
| ---------- | --------------- | ------------------------------------- |
| Color      | `--color-`      | `--color-base`                        |
| Typography | `--font-`       | `--font-family`, `--font-weight-bold` |
| Radius     | `--radius-`     | `--radius-16`, `--radius-full`        |
| Breakpoint | `--breakpoint-` | `--breakpoint-lg`                     |
| Shadow     | `--shadow-`     | `--shadow-dialog`                     |
| Opacity    | `--opacity-`    | `--opcity-disabled`                   |

### Colors

Colors are organized into **global color scales** and **semantic role tokens**.

#### Color Roles

| Role           | Type   | Description                        |
| -------------- | ------ | ---------------------------------- |
| `primary`      | Main   | Primary surface / background color |
| `accent`       | Main   | Accent / highlight color           |
| `neutral`      | Main   | Neutral grays                      |
| `success`      | Status | Positive / success states          |
| `warning`      | Status | Warning / caution states           |
| `danger`       | Status | Error / destructive states         |
| `brand-purple` | Brand  | Brand purple                       |

Each role has three scales: `base`, `dark`, and `light`.

#### Light Mode Example

```css
:root,
.light {
  --neutral-base: #828284;
  --neutral-dark: #565657;
  --neutral-light: #a5a5a6;

  --success-base: #3d9751;
  --danger-base: #e22948;
}
```

#### Dark Mode

Dark mode is activated via a `data-theme` attribute or a `.dark` class:

```html
<html data-theme="dark">
  <!-- or -->
  <div class="dark"></div>
</html>
```

```css
:root[data-theme="dark"],
.dark {
  --primary-base: #1c181d;
  --neutral-base: #8f8f90;
}
```

---

### Semantic / Contextual Colors

Semantic tokens map role-based colors to UI concepts such as `background`, `border`, `text`, and `logo`. These are available as CSS custom properties:

```css
--color-background-base
--color-background-dark
--color-background-light
--color-border-base
--color-border-dark
--color-text-base
--color-logo-primary
--color-logo-secondary
```

---

### `data-color` Contextual Theming

Components can be themed contextually using the `data-color` HTML attribute. This applies the matching color role's semantic tokens to all descendants, without changing the global theme.

```html
<div data-color="success">
  <!-- children inherit success role tokens -->
</div>

<div data-color="danger">
  <!-- children inherit danger role tokens -->
</div>
```

Supported values: `primary` (default), `neutral`, `accent`, `success`, `warning`, `danger`, `brand-purple`.

---

### Typography

Font tokens cover family, size, weight, and line-height for a full heading and body scale. All sizes are in `rem` (base: 16px).

```css
--font-family: "Kantumruy Pro", sans-serif;

--font-line-height-heading-2xlarge: 3.25rem; /* 52px */
--font-line-height-heading-xlarge: 2.5rem; /* 40px */
--font-line-height-heading-large: 2.25rem; /* 36px */
```

---

### Border Radius

```css
--radius-2: 0.125rem;
--radius-4: 0.25rem;
--radius-8: 0.5rem;
--radius-12: 0.75rem;
--radius-16: 1rem;
--radius-full: 9999px;
```

---

### Shadows

```css
--shadow-dialog: 0 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.25);
```

---

### Opacity

```css
--opacity-disabled: 0.3;
```

---

### Breakpoints

Breakpoint tokens cover common responsive ranges with both `min-width` and `max-width` (`-down`) variants:

| Token      | Direction |
| ---------- | --------- |
| `xs`       | min-width |
| `sm`       | min-width |
| `sm-down`  | max-width |
| `md`       | min-width |
| `md-down`  | max-width |
| `lg`       | min-width |
| `lg-down`  | max-width |
| `xl`       | min-width |
| `xl-down`  | max-width |
| `2xl`      | min-width |
| `2xl-down` | max-width |

---

## Package Exports

| Export path                   | Description                             |
| ----------------------------- | --------------------------------------- |
| `@flash/tokens`               | Full bundled CSS (all tokens)           |
| `@flash/tokens/tokens`        | Alias for the full CSS bundle           |
| `@flash/tokens/js`            | ES module with typed JS token constants |
| `@flash/tokens/types`         | TypeScript type declarations only       |
| `@flash/tokens/token_docs`    | Structured token documentation object   |
| `@flash/tokens/css/reset.css` | CSS reset stylesheet                    |

---

## TypeScript Types

Types for all token categories are exported from `@flash/tokens/types`:

```ts
import type {
  ColorRole,
  ColorTheme,
  MainColorRole,
  StatusColorRole,
  BrandColorRole,
  BorderRadiusToken,
  BreakpointToken,
  ShadowToken,
} from "@flash/tokens/types";
```

---

## Development

### Requirements

- Node.js 24+
- TypeScript 5+

### Setup

```bash
pnpm i
```

### Build

```bash
# When in this directory
pnpm build
```

Compiles all token source files into `dist/`, generating:

- `dist/tokens.css` - bundled CSS (all tokens, Lightning CSS processed)
- `dist/tokens.js` / `dist/tokens.d.ts` - ES module with type declarations
- `dist/token_docs.js` - documentation object
- `dist/output.types.d.ts` - exported TypeScript types
- `dist/css/reset.css` - CSS reset

### Test

```bash
pnpm test     # run tests with coverage
```

### Lint & Format

```bash
pnpm lint
pnpm format
pnpm format:check
```

---

## Package Contents

```
src/
├── css/
│   └── reset.css           # CSS for a base look across all browsers
│
├── tokens/                 # All token values
│   └── colors/             # Token values related to color
│       └── roles/          # Categorizing color values into roles for "data-color"
│
├── types/                  # Internal and output types fot this package
└── utils/                  # Utils for calculating and combining token values

```

---

A full overview of how tokes should be used can be found in the [UI package](../ui/), specifically the [Surface Tokens Guide](../ui/src/docs/01-fundementals/SurfaceTokensGuide.mdx)
