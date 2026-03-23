import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { Text } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("John Doe");
    expect(input).toBeInTheDocument();
    expect(canvas.getByText("Nickname")).toBeInTheDocument();
    await userEvent.type(input, "Hello");
    expect(input).toHaveValue("Hello");
  },
};

export const Small: Story = {
  args: {
    label: "Nickname",
    size: "small",
    placeholder: "John Doe",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textfield = canvas.getByTestId("textfield");
    expect(textfield).toBeInTheDocument();
    expect(textfield).toHaveAttribute("data-size", "small"); // adjust to your actual class
  },
};

export const Description: Story = {
  args: {
    label: "Nickname",
    description: "What you will be known as.",
    placeholder: "John Doe",
    icon: <Text />,
    iconPosition: "right",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("What you will be known as.")).toBeInTheDocument();
  },
};

export const HideLabel: Story = {
  args: {
    label: "Nickname",
    hideLabel: true,
    placeholder: "John Doe",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Nickname")).not.toBeVisible();
  },
};

export const Error: Story = {
  args: {
    label: "Nickname",
    error: "Nickname must be filled out.",
    placeholder: "John Doe",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Nickname must be filled out.")).toBeInTheDocument();
    expect(canvas.getByPlaceholderText("John Doe")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Nickname",
    disabled: true,
    placeholder: "John Doe",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("John Doe");
    expect(input).toBeDisabled();
    await userEvent.type(input, "Hello");
    expect(input).toHaveValue("");
  },
};
