import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhoneHeader } from "./PhoneHeader";
import { expect, fn, userEvent, within } from "storybook/test";
import { ArrowLeft, Menu, Image } from "lucide-react";

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
      options: ["primary", "secondary", "tertiary"],
    },
    uploadsRemaining: {
      description: "Number of uploads remaining (shown on desktop only).",
      control: "number",
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
    leftIcon: <ArrowLeft />,
    leftAriaLabel: "Go back",
    rightLabel: "Live",
    rightVariant: "primary",
    onSecondaryClick: fn(),
    onPrimaryClick: fn(),
    uploadsRemaining: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole("banner");
    const title = canvas.getByText(/wedding/i);
    const subtitle = canvas.getByText(/nickname/i);
    const backButton = canvas.getByRole("button", { name: /go back/i });
    const originalBack = window.history.back;
    const backMock = fn();

    window.history.back = backMock as unknown as typeof window.history.back;
    await expect(header).toBeInTheDocument();
    await expect(title).toBeInTheDocument();
    await expect(subtitle).toBeInTheDocument();
    await userEvent.click(backButton);
    await expect(backMock).toHaveBeenCalledTimes(1);
    window.history.back = originalBack;
  },
};

export const BackModerate: Story = {
  args: {
    title: "Wedding",
    subtitle: "Nickname",
    leftIcon: <ArrowLeft />,
    leftAriaLabel: "Go back",
    rightLabel: "Moderate",
    rightIcon: <Image />,
    rightVariant: "secondary",
    onTertiaryClick: fn(),
    uploadsRemaining: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const backButton = canvas.getByRole("button", { name: /go back/i });
    const originalBack = window.history.back;
    const backMock = fn();

    window.history.back = backMock as unknown as typeof window.history.back;
    await userEvent.click(backButton);
    await expect(backMock).toHaveBeenCalledTimes(1);
    window.history.back = originalBack;
  },
};

export const MenuModerate: Story = {
  args: {
    title: "Wedding",
    subtitle: "Nickname",
    leftIcon: <Menu />,
    leftAriaLabel: "Open menu",
    onLeftClick: fn(),
    rightLabel: "Moderate",
    rightIcon: <Image />,
    rightVariant: "secondary",
    onTertiaryClick: fn(),
    uploadsRemaining: 3,
  },
};
