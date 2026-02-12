import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhoneHeader } from "./PhoneHeader";
import { expect, fn, within } from "storybook/test";
import { ArrowLeft, Menu, User, Image } from "lucide-react";

const meta: Meta<typeof PhoneHeader> = {
  title: "Building Blocks/Components/PhoneHeader",
  component: PhoneHeader,
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "The title to display in the phone header.",
      control: "text",
    },
    subtitle: {
      description: "Optional subtitle shown beneath the title.",
      control: "text",
    },
    leftAriaLabel: {
      description: "Accessible label for the left action button.",
      control: "text",
    },
    rightLabel: {
      description: "Text for the right action pill.",
      control: "text",
    },
    rightVariant: {
      description: "Visual style for the right action pill.",
      control: "select",
      options: ["primary", "secondary"],
    },
    className: {
      description: "Optional CSS class name for custom styling.",
      control: "text",
    },
  },
  decorators: [
    Story => (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem" }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PhoneHeader>;

export default meta;
type Story = StoryObj<typeof PhoneHeader>;

export const Default: Story = {
  args: {
    title: "Wedding",
    subtitle: "Nickname",
    subtitleIcon: <User />,
    leftIcon: <ArrowLeft />,
    leftAriaLabel: "Go back",
    onLeftClick: fn(),
    rightLabel: "Live",
    rightVariant: "primary",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole("banner");
    const title = canvas.getByText(/wedding/i);
    const subtitle = canvas.getByText(/nickname/i);
    const rightLabel = canvas.getByText(/live/i);
    await expect(header).toBeInTheDocument();
    await expect(title).toBeInTheDocument();
    await expect(subtitle).toBeInTheDocument();
    await expect(rightLabel).toBeInTheDocument();
  },
};

export const BackModerate: Story = {
  args: {
    title: "Wedding",
    subtitle: "Nickname",
    subtitleIcon: <User />,
    leftIcon: <ArrowLeft />,
    leftAriaLabel: "Go back",
    onLeftClick: fn(),
    rightLabel: "Moderate",
    rightIcon: <Image />,
    rightVariant: "secondary",
    onRightClick: fn(),
  },
};

export const MenuModerate: Story = {
  args: {
    title: "Wedding",
    subtitle: "Nickname",
    subtitleIcon: <User />,
    leftIcon: <Menu />,
    leftAriaLabel: "Open menu",
    onLeftClick: fn(),
    rightLabel: "Moderate",
    rightIcon: <Image />,
    rightVariant: "secondary",
    onRightClick: fn(),
  },
};
