import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Building Blocks/Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

// Variants Story
export const Medium: Story = {
  args: {
    label: "Description",
  },
};

export const Small: Story = {
  args: {
    label: "Description",
    size: "small",
  },
};

export const Description: Story = {
  args: {
    label: "Description",
    description: "Describe what the event is about.",
  },
};

export const HideLabel: Story = {
  args: {
    label: "Description",
    hideLabel: true,
  },
};

export const Error: Story = {
  args: {
    label: "Description",
    error: "The description is too short.",
  },
};

export const MaxLength: Story = {
  args: {
    label: "Description",
    maxLength: 100,
  },
};

export const Resizable: Story = {
  args: {
    label: "Description",
    resize: "vertical",
  },
};

export const AutoScrollbar: Story = {
  render: () => (
    <div style={{ height: "200px" }}>
      <Textarea label="Description" scroll />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Description",
    disabled: true,
  },
};
