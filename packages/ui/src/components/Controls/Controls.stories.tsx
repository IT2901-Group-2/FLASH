import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Controls } from "./Controls";

const meta: Meta<typeof Controls> = {
  title: "Byggeklosser/Komponenter/Controls",
  component: Controls,
  decorators: [
    Story => (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Story />
      </div>
    ),
  ],
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

export const Basic: Story = {
  render: () => {
    const [value, setValue] =
      React.useState<(typeof EnableDisable)[number]["value"]>("enable");

    return (
      <Controls
        options={EnableDisable}
        value={value}
        onChange={setValue}
        variant="primary"
        data-color="accent"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Controls options={EnableDisable} value="enable" variant="primary" disabled />
  ),
};

export const Three_Items: Story = {
  render: () => (
    <Controls
      options={ThreeOptions}
      value="center"
      variant="primary"
      data-color="accent"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <Controls
      options={EnableDisable}
      value="enable"
      variant="primary"
      data-color="accent"
      loading
    />
  ),
};
