import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "storybook/internal/components";

const meta: Meta<typeof Select> = {
  title: "Building Blocks/Components/Textarea",
  component: Select,
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Size: Story = {
  args: {},
};
