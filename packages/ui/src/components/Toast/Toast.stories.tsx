import { Meta, StoryObj } from "@storybook/react-vite";
import Toast, { useToast } from "./Toast";
import { ToastItem, ToastPosition } from "./Toast.type";
import { ColorName } from "../types";
import { Button } from "../Button";
import Toaster from "./Toaster";
import { CircleAlert } from "lucide-react";
import { expect, userEvent } from "storybook/test";

const baseToast: ToastItem = {
  id: "toast-1",
  title: "Toast title",
  description: "This is the toast description.",
  "data-color": "neutral",
  duration: 0,
  open: true,
};

const meta: Meta<typeof Toast> = {
  title: "Building Blocks/Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [
    Story => (
      <Toast.Provider onToastsChange={console.log}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Story />
        </div>
      </Toast.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Toast>;

function makeToast(variant: ColorName, overrides: Partial<ToastItem> = {}): ToastItem {
  return {
    ...baseToast,
    id: `toast-${variant}`,
    "data-color": variant,
    ...overrides,
  };
}

/** A single Toast rendered directly */
export const Default: Story = {
  args: {
    toast: {
      title: "Toast title",
      description: "This is the toast description.",
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Toast title")).toBeVisible();
    await expect(canvas.getByText("This is the toast description.")).toBeVisible();
  },
};

/**
 * The recommended pattern: place one <Toaster> in your app root (inside
 * <Toast.Provider>). Trigger toasts from anywhere via useToast().createToast().
 * Toasts stack and auto-dismiss after their duration.
 */
export const WithToaster: Story = {
  render: () => {
    const { createToast } = useToast();

    return (
      <>
        <Toaster />
        <Button
          onClick={() =>
            createToast({
              title: "Success",
              description: "Your changes have been saved.",
              "data-color": "success",
              duration: 4000,
            })
          }
        >
          Success toast
        </Button>
        <Button
          onClick={() =>
            createToast({
              title: "Warning",
              description: "Your session expires soon.",
              "data-color": "warning",
              duration: 4000,
            })
          }
        >
          Warning toast
        </Button>
        <Button
          onClick={() =>
            createToast({
              title: "Error",
              description: "Something went wrong.",
              "data-color": "danger",
              duration: 4000,
            })
          }
        >
          Error toast
        </Button>
        <Button
          onClick={() =>
            createToast({
              title: "Heads up",
              description: "A new version is available.",
              "data-color": "neutral",
              duration: 100000,
              action: { label: "Update", onClick: () => alert("Updating…") },
            })
          }
        >
          With action
        </Button>
        <Button
          onClick={() =>
            createToast({
              title: "Persistent",
              description: "This toast won't auto-dismiss (duration: 0).",
              "data-color": "brand-purple",
              duration: 0,
            })
          }
        >
          Persistent toast
        </Button>
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Success toast" }));
    await expect(await canvas.findByText("Your changes have been saved.")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Warning toast" }));
    await expect(await canvas.findByText("Your session expires soon.")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Error toast" }));
    await expect(await canvas.findByText("Something went wrong.")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "With action" }));
    await expect(await canvas.findByText("A new version is available.")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Persistent toast" }));
    await expect(
      await canvas.findByText("This toast won't auto-dismiss (duration: 0).")
    ).toBeVisible();
  },
};

/**
 * Each button fires a toast at that named position.
 * Note: a single <Toaster> handles one position. For multi-position support
 * you can mount multiple <Toaster> components with different positions.
 */
export const Positions: Story = {
  render: () => {
    const { createToast } = useToast();
    const POSITIONS: ToastPosition[] = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];

    return (
      <>
        {POSITIONS.map(position => (
          <Button
            key={position}
            onClick={() =>
              createToast({
                title: position,
                description: "Toasts appear here.",
                "data-color": "neutral",
                duration: 3000,
                icon: <CircleAlert />,
                position,
              })
            }
          >
            {position}
          </Button>
        ))}
        <Toaster />
      </>
    );
  },
};

/** All colour variants rendered as static toasts for visual reference. */
export const AllVariants: Story = {
  render: () => {
    const variants: ColorName[] = [
      "accent",
      "brand-purple",
      "danger",
      "neutral",
      "primary",
      "success",
      "warning",
    ];

    return (
      <div style={{ display: "grid", gap: 12 }}>
        {variants.map(variant => (
          <Toast
            key={variant}
            toast={{
              title: `${variant[0].toUpperCase()}${variant.slice(1)} toast`,
              description: `Variant: ${variant}`,
              duration: 0,
            }}
          />
        ))}
      </div>
    );
  },
};

/**
 * Demonstrates auto-dismiss. Each toast disappears after its configured
 * duration. Click multiple buttons to see them stack.
 */
export const AutoDismiss: Story = {
  render: () => {
    const { createToast } = useToast();

    return (
      <>
        <Toaster />
        {[1000, 2000, 3000, 5000].map(ms => (
          <Button
            key={ms}
            onClick={() =>
              createToast({
                title: `Dismisses in ${ms / 1000}s`,
                description: `duration: ${ms}`,
                "data-color": "neutral",
                duration: ms,
              })
            }
          >
            {ms / 1000}s
          </Button>
        ))}
      </>
    );
  },
};
