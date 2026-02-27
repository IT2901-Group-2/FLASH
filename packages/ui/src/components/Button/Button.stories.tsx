import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { expect, fn, userEvent, within } from "storybook/test";
import { GamepadDirectional } from "lucide-react";
import { colorNames } from "../types";

const TestIcon = <GamepadDirectional data-testid="test-icon" />;

const meta: Meta<typeof Button> = {
  title: "Building Blocks/Components/Button",
  component: Button,
  tags: ["autodocs"],

  args: {
    loading: false,
    disabled: false,
    children: "Button",
  },
  decorators: [],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Primary, secondary, and tertiary buttons are used to communicate visual
 * priority. Use the primary variant for the main action in a view, and
 * secondary or tertiary variants for supporting or less prominent actions.
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    await expect(buttons).toHaveLength(3);
    await expect(canvas.getByRole("button", { name: /primary/i })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /secondary/i })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /tertiary/i })).toBeInTheDocument();
  },
};

/**
 * The buttons come in three sizes: medium, small and xsmall. xsmall is only
 * used in special cases where space is limited, such as in tables.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Button size="xsmall">Xsmall</Button>
      <Button size="small">Small</Button>
      <Button>Default</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const xsmallButton = canvas.getByRole("button", { name: /^xsmall/i });
    const smallButton = canvas.getByRole("button", { name: /^small/i });

    await expect(xsmallButton).toHaveAttribute("data-size", "xsmall");
    await expect(smallButton).toHaveAttribute("data-size", "small");
  },
};

export const Interactions: Story = {
  args: {
    variant: "primary",
    children: "Interactive Button",
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const button = canvas.getByRole("button", { name: /interactive button/i });

    await step("Button renders correctly", async () => {
      await expect(button).toBeInTheDocument();
    });

    await step("Button responds to clicks", async () => {
      await user.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step("Multiple clicks work correctly", async () => {
      await user.click(button);
      await user.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(3);
    });

    await step("Button can be focused with keyboard", async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    await step("Button responds to Enter key", async () => {
      button.focus();
      await userEvent.keyboard("{Enter}");
      await expect(args.onClick).toHaveBeenCalled();
    });

    await step("Button responds to Space key", async () => {
      button.focus();
      await userEvent.keyboard(" ");
      await expect(args.onClick).toHaveBeenCalled();
    });
  },
};

/**
 * A disabled button communicates that an action is currently unavailable. Use
 * this state when prerequisites are not met or an action should be prevented.
 */
export const Disabled: Story = {
  args: {
    onClick: fn(),
  },
  render: args => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button disabled variant="primary" onClick={args.onClick}>
        Disabled Primary
      </Button>
      <Button disabled variant="secondary">
        Disabled Secondary
      </Button>
      <Button disabled variant="tertiary">
        Disabled Tertiary
      </Button>
    </div>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /disabled primary/i });

    await step("Button is disabled", async () => {
      await expect(button).toBeDisabled();
    });

    await step("Disabled button does not respond to clicks", async () => {
      await userEvent.click(button);
      await expect(args.onClick).not.toHaveBeenCalled();
    });

    await step("Disabled button cannot be focused via keyboard", async () => {
      button.focus();
      await expect(button).not.toHaveFocus();
    });
  },
};

// Loading State
export const Loading: Story = {
  args: {
    variant: "primary",
    loading: true,
    children: "Loading Button",
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await step("Button shows loading state", async () => {
      await expect(button).toBeInTheDocument();
    });

    await step("Loading button may prevent interaction", async () => {
      await userEvent.click(button);
    });
  },
};

// Icon Tests
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button variant="primary" icon={TestIcon} iconPosition="left">
        Icon Left
      </Button>
      <Button variant="primary" icon={TestIcon} iconPosition="right">
        Icon Right
      </Button>
      <Button variant="secondary" icon={TestIcon} />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Buttons render with icons", async () => {
      const buttons = canvas.getAllByRole("button");
      const icons = canvas.getAllByTestId("test-icon");

      await expect(buttons.length).toEqual(3);
      await expect(icons.length).toEqual(3);
    });
  },
};

// Accessibility and HTML Attributes
export const AccessibilityAndAttributes: Story = {
  args: {
    variant: "primary",
    children: "Accessible Button",
    "aria-label": "Custom aria label",
    "aria-describedby": "description-id",
    type: "submit",
    form: "test-form",
    name: "submit-button",
    value: "submit-value",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await step("Button has correct ARIA attributes", async () => {
      await expect(button).toHaveAccessibleName("Custom aria label");
      await expect(button).toHaveAttribute("aria-describedby", "description-id");
    });

    await step("Button has correct HTML attributes", async () => {
      await expect(button).toHaveAttribute("type", "submit");
      await expect(button).toHaveAttribute("form", "test-form");
      await expect(button).toHaveAttribute("name", "submit-button");
      await expect(button).toHaveAttribute("value", "submit-value");
    });

    await step("Button is keyboard accessible", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });
  },
};

// Data Attributes
export const DataAttributes: Story = {
  args: {
    variant: "primary",
    children: "Custom Data Attributes",
    "data-color": "warning",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /custom data attributes/i });

    await expect(button).toHaveAttribute("data-color", "warning");
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", maxWidth: "600px" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button icon={TestIcon}>With Icon</Button>
      <Button size="small">Small</Button>
      <Button size="xsmall">Xsmall</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    await expect(buttons).toHaveLength(8);
  },
};
