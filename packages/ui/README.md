# @flash/ui

The component library for the Flash design system. Built with React 19 and TypeScript, themed via design tokens, and documented and tested with Storybook.

---

## What this package provides

`@flash/ui` is the single source of truth for UI components across Flash products. It exports:

- **React components** - layout, forms, feedback, and display primitives
- **TypeScript types** - full prop types for every component, including the shared `ColorName` type

All components are scoped with CSS Modules and pick up their colour values from `@flash/tokens` via CSS custom properties, meaning they automatically reflect the active theme without any runtime JS.

---

## Components

| Component                | Category            | Description                                                                                                                                                        |
| ------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Sidebar`                | Layout & Navigation | Collapsible application sidebar with `Sidebar.Provider`, `Sidebar.Item`, `Sidebar.Group`, `Sidebar.Header`, `Sidebar.Footer`, and `Sidebar.Trigger` sub-components |
| `Breadcrumb`             | Layout & Navigation | Navigation breadcrumb trail                                                                                                                                        |
| `Card`                   | Content & Display   | Basic content container                                                                                                                                            |
| `ActionCard`             | Content & Display   | Card with configurable primary and secondary `Button` actions                                                                                                      |
| `ImageCard`              | Content & Display   | Card with a prominent image area                                                                                                                                   |
| `Title`                  | Content & Display   | Typographic heading component                                                                                                                                      |
| `Logo`                   | Content & Display   | Flash logo component. Can also be used as a loader.                                                                                                                |
| `QRDisplay`              | Content & Display   | Renders a QR code from a given value                                                                                                                               |
| `Dialog`                 | Content & Display   | Modal dialog overlay                                                                                                                                               |
| ~~`Input`~~ (Depricated) | Form & Input        | **Deprecated.** _Use other form components instead_. ~~Single-line text input with label, helper text, error, and success states~~                                 |
| `TextField`              | Form & Input        | Managed text field for use within a form context                                                                                                                   |
| `Textarea`               | Form & Input        | Multi-line text area with auto-resize                                                                                                                              |
| `Select`                 | Form & Input        | Dropdown selection with accessible option list                                                                                                                     |
| `DropdownControl`        | Form & Input        | Controlled dropdown primitive                                                                                                                                      |
| `SegmentedControl`       | Form & Input        | Segmented button group for mutually exclusive choices                                                                                                              |
| `DatePicker`             | Form & Input        | Calendar-based date picker                                                                                                                                         |
| `Button`                 | Feedback & Status   | Action trigger with `primary`, `secondary`, and `tertiary` variants                                                                                                |
| `Loader`                 | Feedback & Status   | Animated loading spinner                                                                                                                                           |
| `ProgressBar`            | Feedback & Status   | Linear progress indicator                                                                                                                                          |
| `ProgressDots`           | Feedback & Status   | Step-based dot progress indicator                                                                                                                                  |
| `Switch`                 | Feedback & Status   | Toggle switch for boolean settings                                                                                                                                 |

---

## How to import components

This package is consumed via the monorepo workspace protocol. Add it to a package's `package.json`:

```json
{
  "dependencies": {
    "@flash/ui": "workspace:*"
  }
}
```

Then import directly from the package root - no deep imports needed:

```tsx
import { Button, Card, Form, Sidebar } from "@flash/ui";
```

---

## Component usage examples

### Button

```tsx
import { Button } from "@flash/ui";

// Variants
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="tertiary">Learn more</Button>

// With icon and loading state
<Button icon={<UploadIcon />} loading={isSubmitting}>
  Upload
</Button>

// Stretch to fill container
<Button fill>Full-width action</Button>
```

### Form fields

Form components are designed to work with `react-hook-form` but accept standard React controlled props too:

```tsx
import { useForm } from "react-hook-form";
import { Button, Form } from "@flash/ui";

function EventForm() {
  const { register, control, handleSubmit } = useForm<{ name: string }>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <TextField
        label="Event name"
        aria-label="Event name"
        {...register("name", { required: true })}
      />
      <Textarea label="Description" aria-label="Description" />
      <DatePicker control={control} name="date" />
      <Select label="Sort order" aria-label="Sort order">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </Select>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Sidebar

```tsx
import { Sidebar } from "@flash/ui";

<Sidebar.Provider>
  <Sidebar>
    <Sidebar.Header>My App</Sidebar.Header>
    <Sidebar.Group label="Main">
      <Sidebar.Item href="/dashboard">Dashboard</Sidebar.Item>
      <Sidebar.Item href="/settings">Settings</Sidebar.Item>
    </Sidebar.Group>
  </Sidebar>
</Sidebar.Provider>;
```

---

## Styling conventions and dependencies

### CSS Modules

Every component has a co-located `.module.css` file. Class names are local by default and never leak globally. The `cl()` utility (a lightweight `clsx` alternative exported from the package root) is used throughout to compose class names conditionally:

```tsx
import { cl } from "@flash/ui";

<div className={cl(styles.base, isActive && styles.active, className)} />;
```

### Design tokens

All colour values, spacing, typography, radii, and opacity are consumed as CSS custom properties sourced from `@flash/tokens`. Components never hardcode colour values - they reference variables like `--color-base`, `--radius-full`, `--font-size-large`, and `--opacity-disabled`.

### Theming with `data-color`

Components expose a `data-color` prop that accepts a `ColorName` (a `ColorRole` from `@flash/tokens`). Setting it overrides the inherited colour role for that component and any children that read `--color-base`:

```tsx
<Button data-color="brand-purple">Primary action</Button>
<Button data-color="neutral">Secondary action</Button>
```

### Fonts

Storybook previews load **Nunito Sans** (primary) and **Verdana** (fallback). Ensure these fonts are available in the consuming application.

---

## How components depend on `tokens`

`@flash/tokens` is a workspace sibling declared as a direct dependency:

```json
"@flash/tokens": "workspace:*"
```

It provides:

- **CSS custom properties** injected at the `:root` level - all `--color-*`, `--radius-*`, `--font-size-*`, etc. variables that component stylesheets reference
- **TypeScript types** - `ColorRole` is re-exported from `@flash/ui` as `ColorName`, which is the accepted type for all `data-color` props

If `@flash/tokens` is not loaded in the consuming application, components will render without colour or spacing. Ensure the tokens stylesheet is imported at the app root before rendering any `@flash/ui` components.

---

## Running component development locally

Start Storybook for a full live-reload development loop:

```bash
# Start Storybook on http://localhost:6006
pnpm storybook
```

Storybook picks up stories from `src/**/*.stories.tsx` and MDX documentation from `src/**/*.mdx`. No manual registration is needed - add a `.stories.tsx` file next to a component and it appears automatically.

---

## How to use Storybook

Storybook is the primary environment for developing, reviewing, and documenting components. It includes four addons:

| Addon                      | Purpose                                                        |
| -------------------------- | -------------------------------------------------------------- |
| `@storybook/addon-docs`    | Auto-generates prop tables and renders MDX documentation pages |
| `@storybook/addon-a11y`    | Runs axe accessibility checks on every story                   |
| `@storybook/addon-vitest`  | Runs Vitest tests directly inside the Storybook UI             |
| `@chromatic-com/storybook` | Enables Chromatic visual regression snapshots                  |

Stories are organised into four top-level sections: **Fundamentals**, **Building Blocks › Components**, **Building Blocks › Icons**, and **Patterns and Templates**.

To add a new story for an existing component, create a `ComponentName.stories.tsx` file next to the component:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Building Blocks/Components/Button",
  component: Button,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Click me", variant: "primary" },
};
```

Build a static Storybook for deployment:

```bash
pnpm build-storybook
```

---

## Testing, linting, and build

### Tests

Tests are written as Storybook `play` functions and run in a real Chromium browser via Playwright and Vitest:

```bash
pnpm test
```

Coverage is collected with Istanbul and reported to the console. To add a test, add a `play` function to a story:

```tsx
export const Clickable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await expect(canvas.getByText("Clicked!")).toBeInTheDocument();
  },
};
```

### Linting and formatting

```bash
pnpm lint          # ESLint - zero warnings policy enforced
pnpm format        # Prettier - rewrites src/ in place
pnpm format:check  # Prettier - exits non-zero if files are unformatted
```

### Build

```bash
pnpm build   # Type-check with tsc, then bundle with Vite
pnpm dev     # Watch mode - rebuilds on every file change
```

The build outputs to `dist/`:

React and React DOM are externalized and must be provided by the consuming application.

---

## All scripts

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `pnpm build`           | Type-check and bundle the library to `dist/`       |
| `pnpm dev`             | Watch mode - rebuild on file changes               |
| `pnpm storybook`       | Start Storybook dev server on port 6006            |
| `pnpm build-storybook` | Build a static Storybook site                      |
| `pnpm test`            | Run Storybook-based tests with Vitest + Playwright |
| `pnpm lint`            | Run ESLint (zero warnings allowed)                 |
| `pnpm format`          | Format `src/` with Prettier                        |
| `pnpm format:check`    | Check formatting without writing changes           |

---

## Package structure

```
src/
├── components/         # All UI components
│   ├── Button/
│   ├── Form/           # TextField, Textarea, Select, DatePicker, etc.
│   ├── Sidebar/        # Sidebar + sub-components
│   ├── types/          # Shared types (ColorName)
│   └── index.ts        # Component barrel export
├── util/
│   ├── helpers/        # cl(), omit(), composeEventHandlers(), etc.
│   └── hooks/          # useControllableState, useMergeRefs, useAutoResize
├── docs/               # MDX documentation pages (loaded by Storybook)
└── index.ts            # Package entry point
```

## Dependencies

**Peer dependencies** (must be provided by the consuming app):

- `react` ^19
- `react-dom` ^19

**Internal workspace dependency:**

- [`@flash/tokens`](../tokens) - Design tokens and colour role types
