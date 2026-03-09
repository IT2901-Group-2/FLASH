import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Text } from "lucide-react";

const meta: Meta<typeof TextField> = {
  title: "Building Blocks/Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof TextField>;

// Variants Story
export const Medium: Story = {
  args: {
    label: "Nickname",
    icon: <Text />,
    placeholder: "John Doe",
  },
};

export const Small: Story = {
  args: {
    label: "Nickname",
    size: "small",
    placeholder: "John Doe",
  },
};

export const Description: Story = {
  args: {
    label: "Nickname",
    description: "What you will be known as.",
    placeholder: "John Doe",
  },
};

export const HideLabel: Story = {
  args: {
    label: "Nickname",
    hideLabel: true,
    placeholder: "John Doe",
  },
};

export const Error: Story = {
  args: {
    label: "Nickname",
    error: "Nickname must be filled out.",
    placeholder: "John Doe",
  },
};

export const Disabled: Story = {
  args: {
    label: "Nickname",
    disabled: true,
    placeholder: "John Doe",
  },
};

export const AllTypes: Story = {
  render: () => (
    <>
      <TextField type="email" label="email" />
      <TextField type="number" label="number" />
      <TextField type="password" label="password" />
      <TextField type="tel" label="tel" />
      <TextField type="text" label="text" />
      <TextField type="url" label="url" />
      <TextField type="time" label="time" />
    </>
  ),
};
