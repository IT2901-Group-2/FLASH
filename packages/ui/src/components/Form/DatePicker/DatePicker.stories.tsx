import type { Meta, StoryObj } from "@storybook/react-vite";
import DatePicker from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Building Blocks/Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof DatePicker>;

// Variants Story
export const Medium: Story = {
  args: {
    label: "Date",
    "data-color": "accent",
  },
};
