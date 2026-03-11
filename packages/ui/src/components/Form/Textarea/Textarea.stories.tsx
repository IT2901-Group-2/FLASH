import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";
import { expect, userEvent, within } from "storybook/test";

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");
    expect(canvas.getByText("Description")).toBeInTheDocument();
    await userEvent.type(textarea, "Hello");
    expect(textarea).toHaveValue("Hello");
  },
};

export const Small: Story = {
  args: {
    label: "Description",
    size: "small",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("textbox").closest("[data-size]")).toHaveAttribute(
      "data-size",
      "small"
    );
  },
};

export const Description: Story = {
  args: {
    label: "Description",
    description: "Describe what the event is about.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Describe what the event is about.")).toBeInTheDocument();
  },
};

export const HideLabel: Story = {
  args: {
    label: "Description",
    hideLabel: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Description")).not.toBeVisible();
  },
};

export const Error: Story = {
  args: {
    label: "Description",
    error: "The description is too short.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("The description is too short.")).toBeInTheDocument();
    expect(canvas.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(canvas.getByRole("textbox").closest("[data-error]")).toHaveAttribute(
      "data-error",
      "true"
    );
  },
};

export const MaxLength: Story = {
  args: {
    label: "Description",
    maxLength: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("0/100")).toBeInTheDocument();
    await userEvent.type(canvas.getByRole("textbox"), "Hello");
    expect(canvas.getByText("5/100")).toBeInTheDocument();
  },
};

export const Resizable: Story = {
  args: {
    label: "Description",
    resize: "vertical",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("textbox")).toHaveAttribute("data-resize", "vertical");
  },
};

export const AutoScrollbar: Story = {
  render: () => (
    <div style={{ height: "200px" }}>
      <Textarea label="Description" scroll />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("textbox")).toHaveAttribute("data-scroll", "true");
  },
};

export const Disabled: Story = {
  args: {
    label: "Description",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");
    expect(textarea).toBeDisabled();
    await userEvent.type(textarea, "Hello");
    expect(textarea).toHaveValue("");
  },
};
