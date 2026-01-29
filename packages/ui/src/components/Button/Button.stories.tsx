import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { expect, fn, userEvent, within } from "storybook/test";
import { GamepadDirectional } from "lucide-react";

const TestIcon = <GamepadDirectional data-testid="test-icon" />;

const meta: Meta<typeof Button> = {
  title: "Byggeklosser/Komponenter/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    children: { control: { type: "text" } },
  },
  decorators: [],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimaryVariant: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /primary button/i });

    await expect(button).toBeInTheDocument();
  },
};

export const SecondaryVariant: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /secondary button/i });

    await expect(button).toBeInTheDocument();
  },
};

export const TertiaryVariant: Story = {
  args: {
    variant: "tertiary",
    children: "Tertiary Button",
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /tertiary button/i });

    await expect(button).toBeInTheDocument();
  },
};

export const ClickInteraction: Story = {
  args: {
    variant: "primary",
    children: "Click Me",
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Button renders with correct text", async () => {
      const button = await canvas.findByRole("button", { name: /click me/i });
      await expect(button).toBeInTheDocument();
    });

    await step("Button is clickable and fires onClick", async () => {
      const button = await canvas.findByRole("button", { name: /click me/i });
      await user.click(button);
      console.log("args.onClick is", args.onClick);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    await step("Multiple clicks work correctly", async () => {
      const button = await canvas.findByRole("button", { name: /click me/i });
      await user.click(button);
      await user.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(3);
    });
  },
};

export const DisabledButton: Story = {
  args: {
    variant: "primary",
    children: "Disabled Button",
    disabled: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Button is disabled", async () => {
      const button = canvas.getByRole("button", { name: /disabled button/i });
      await expect(button).toBeDisabled();
    });

    await step("Disabled button does not respond to clicks", async () => {
      const button = canvas.getByRole("button", { name: /disabled button/i });
      await userEvent.click(button);
      await expect(args.onClick).not.toHaveBeenCalled();
    });

    await step("Disabled button cannot be focused via keyboard", async () => {
      const button = canvas.getByRole("button", { name: /disabled button/i });
      button.focus();
      await expect(button).not.toHaveFocus();
    });
  },
};

// Loading State Tests
export const LoadingButton: Story = {
  args: {
    variant: "primary",
    loading: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Button shows loading state", async () => {
      const button = canvas.getByRole("button");
      await expect(button).toBeInTheDocument();
    });

    await step("Loading button may prevent interaction", async () => {
      const button = canvas.getByRole("button");
      await userEvent.click(button);
    });
  },
};

// Icon Tests
export const ButtonWithIconLeft: Story = {
  args: {
    variant: "primary",
    children: "Button with Icon",
    icon: TestIcon,
    iconPosition: "left",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Button renders with icon on the left", async () => {
      const button = canvas.getByRole("button", { name: /button with icon/i });
      const icon = canvas.getByTestId("test-icon");

      await expect(button).toBeInTheDocument();
      await expect(icon).toBeInTheDocument();
    });
  },
};

// Data Attribute Tests
export const ButtonWithDataColor: Story = {
  args: {
    variant: "primary",
    children: "Custom Color",
    "data-color": "warning",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /custom color/i });

    await expect(button).toHaveAttribute("data-color", "warning");
  },
};

// Keyboard Interaction Tests
export const KeyboardInteraction: Story = {
  args: {
    variant: "primary",
    children: "Keyboard Test",
    onClick: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Button can be focused with keyboard", async () => {
      const button = canvas.getByRole("button", { name: /keyboard test/i });
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Button responds to Enter key", async () => {
      const button = canvas.getByRole("button", { name: /keyboard test/i });
      button.focus();
      await userEvent.keyboard("{Enter}");
      await expect(args.onClick).toHaveBeenCalled();
    });

    await step("Button responds to Space key", async () => {
      const button = canvas.getByRole("button", { name: /keyboard test/i });
      button.focus();
      await userEvent.keyboard(" ");
      await expect(args.onClick).toHaveBeenCalled();
    });
  },
};

// HTML Attributes Tests
export const ButtonWithCustomAttributes: Story = {
  args: {
    variant: "primary",
    children: "Custom Attributes",
    type: "submit",
    form: "test-form",
    name: "submit-button",
    value: "submit-value",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Button has correct HTML attributes", async () => {
      const button = canvas.getByRole("button", { name: /custom attributes/i });

      await expect(button).toHaveAttribute("type", "submit");
      await expect(button).toHaveAttribute("form", "test-form");
      await expect(button).toHaveAttribute("name", "submit-button");
      await expect(button).toHaveAttribute("value", "submit-value");
    });
  },
};

// Accessibility Tests
export const AccessibilityTest: Story = {
  args: {
    variant: "primary",
    children: "Accessible Button",
    "aria-label": "Custom aria label",
    "aria-describedby": "description-id",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Button has correct ARIA attributes", async () => {
      const button = canvas.getByRole("button");

      await expect(button).toHaveAccessibleName("Custom aria label");
      await expect(button).toHaveAttribute("aria-describedby", "description-id");
    });

    await step("Button is keyboard accessible", async () => {
      const button = canvas.getByRole("button");
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });
  },
};

// All Variants Comparison
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button variant="primary" loading>
        Loading
      </Button>
      <Button variant="primary" icon={TestIcon}>
        With Icon
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    await expect(buttons).toHaveLength(6);
  },
};
