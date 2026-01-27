import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { fn } from "storybook/test";

const meta: Meta<typeof Input> = {
  title: "Byggeklosser/Komponenter/Input",
  component: Input,
  argTypes: {},
  args: { onClick: fn() },
  decorators: [
    Story => (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Standard_Purple: Story = {
  render: () => (
    <>
      <Input />
    </>
  ),
};
