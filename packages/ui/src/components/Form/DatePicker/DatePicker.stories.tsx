import type { Meta, StoryObj } from "@storybook/react-vite";
import DatePicker from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Building Blocks/Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    label: "Select dates",
    local: "en-US",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof DatePicker>;

// Variants Story
export const Default: Story = {
  args: {
    label: "Date",
    "data-color": "accent",
  },
};

export const Locale: Story = {
  args: {
    label: "Date",
    "data-color": "accent",
    local: "no",
  },
};
