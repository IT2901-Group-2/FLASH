import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Controls } from "./Controls";
import { expect, fn, userEvent, within } from "storybook/test";
import { colorNames } from "@/styles/colorType";

const meta: Meta<typeof Controls> = {
  title: "Byggeklosser/Komponenter/Controls",
  component: Controls,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: colorNames,
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
  },
  decorators: [],
} satisfies Meta<typeof Controls>;

export default meta;
type Story = StoryObj<typeof Controls>;

const EnableDisable = [
  { value: "enable", label: "Enable" },
  { value: "disable", label: "Disable" },
] as const;

const ThreeOptions = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
] as const;

// Wrapper around controls for testing of interactions w/state
const StatefulControls = ({
  options,
  initialValue,
  ...rest
}: {
  options: readonly { value: string; label: React.ReactNode }[];
  initialValue: string;
} & Omit<React.ComponentProps<typeof Controls>, "options" | "value">) => {
  const [value, setValue] = React.useState(initialValue);

  const { onChange, ...restProps } = rest as React.ComponentProps<typeof Controls>;

  const handleChange = (v: string) => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <Controls {...restProps} options={options} value={value} onChange={handleChange} />
  );
};

export const RendersCorrectly: Story = {
  render: args => {
    const { options: _options, value: _value, ...rest } = args;
    return <StatefulControls options={EnableDisable} initialValue="enable" {...rest} />;
  },
  args: {
    variant: "primary",
    "data-color": "accent",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders with two options", async () => {
      const group = canvas.getByRole("radiogroup");
      await expect(group).toBeInTheDocument();
      const radios = canvas.getAllByRole("radio");
      await expect(radios).toHaveLength(2);
    });

    await step("Active option is checked", async () => {
      const enable = canvas.getByRole("radio", { name: /enable/i });
      const disable = canvas.getByRole("radio", { name: /disable/i });
      await expect(enable).toHaveAttribute("aria-checked", "true");
      await expect(disable).toHaveAttribute("aria-checked", "false");
    });
  },
};

export const ClickInteraction: Story = {
  render: args => {
    const { options: _options, value: _value, ...rest } = args;
    return <StatefulControls options={EnableDisable} initialValue="enable" {...rest} />;
  },
  args: {
    variant: "primary",
    "data-color": "accent",
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Clicking option triggers onChange", async () => {
      const disable = canvas.getByRole("radio", { name: /disable/i });
      await user.click(disable);
      await expect(args.onChange).toHaveBeenCalledTimes(1);
      await expect(args.onChange).toHaveBeenCalledWith("disable");
    });
  },
};

// Disabled State Tests
export const Disabled: Story = {
  render: args => {
    const { options: _options, value: _value, ...rest } = args;
    return <StatefulControls options={EnableDisable} initialValue="enable" {...rest} />;
  },
  args: {
    options: EnableDisable,
    value: "enable",
    variant: "primary",
    disabled: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("All options are disabled", async () => {
      const radios = canvas.getAllByRole("radio");
      radios.forEach(radio => expect(radio).toBeDisabled());
    });

    await step("Disabled options do not trigger onChange", async () => {
      const disable = canvas.getByRole("radio", { name: /disable/i });
      await userEvent.click(disable);
      await expect(args.onChange).not.toHaveBeenCalled();
    });
  },
};

// Keyboard Interaction Tests
export const KeyboardInteraction: Story = {
  render: args => {
    const { options: _options, value: _value, ...rest } = args;
    return <StatefulControls options={EnableDisable} initialValue="enable" {...rest} />;
  },
  args: {
    variant: "primary",
    "data-color": "accent",
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Active option is focusable", async () => {
      const enable = canvas.getByRole("radio", { name: /enable/i });
      enable.focus();
      await expect(enable).toHaveFocus();
    });

    await step("Button responds to Enter key", async () => {
      const enable = canvas.getByRole("radio", { name: /enable/i });
      enable.focus();
      await userEvent.keyboard("{Enter}");
      await expect(args.onChange).toHaveBeenCalled();
    });

    await step("Button responds to Space key", async () => {
      const enable = canvas.getByRole("radio", { name: /enable/i });
      enable.focus();
      await userEvent.keyboard(" ");
      await expect(args.onChange).toHaveBeenCalled();
    });
  },
};

// Data Attribute Tests
export const ControlsWithDataColor: Story = {
  render: args => {
    const { options: _options, value: _value, ...rest } = args;
    return <StatefulControls options={EnableDisable} initialValue="enable" {...rest} />;
  },
  args: {
    options: EnableDisable,
    variant: "primary",
    "data-color": "warning",
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Controls has data-color", async () => {
      const group = canvas.getByRole("radiogroup");
      await expect(group).toHaveAttribute("data-color", "warning");
    });

    await step("Clicking option triggers onChange", async () => {
      const disable = canvas.getByRole("radio", { name: /disable/i });
      await userEvent.click(disable);
      await expect(args.onChange).toHaveBeenCalled();
    });
  },
};

// Loading State Tests
export const LoadingControls: Story = {
  args: {
    options: EnableDisable,
    value: "enable",
    variant: "primary",
    "data-color": "accent",
    loading: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Controls shows loading state", async () => {
      const status = canvas.getByRole("status");
      await expect(status).toHaveAttribute("aria-busy", "true");
    });

    await step("Loading Controls may prevent interaction", async () => {
      const status = canvas.getByRole("status");
      await userEvent.click(status);
    });
  },
};

// Controls with Three Options
export const Three_Items: Story = {
  render: () => (
    <StatefulControls
      options={ThreeOptions}
      initialValue="center"
      variant="primary"
      data-color="accent"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders three options", async () => {
      const radios = canvas.getAllByRole("radio");
      await expect(radios).toHaveLength(3);
    });

    await step("Center is selected by default", async () => {
      const center = canvas.getByRole("radio", { name: /center/i });
      await expect(center).toHaveAttribute("aria-checked", "true");
    });
  },
};
