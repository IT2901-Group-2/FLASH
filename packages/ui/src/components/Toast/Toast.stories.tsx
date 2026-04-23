import { Meta, StoryObj } from "@storybook/react-vite";
import Toast, { useToast } from "./Toast";
import { ToastPosition } from "./Toast.type";
import { ColorName } from "../types";
import { Button } from "../Button";
import Toaster from "./Toaster";
import { CircleAlert } from "lucide-react";
import { expect, userEvent } from "storybook/test";

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

/** A single Toast rendered directly */
export const Default: Story = {
  args: {
    toast: {
      title: "Toast title",
      description: "This is the toast description.",
    },
  },
  play: async ({ canvas, step }) => {
    await step("Render the default toast", async () => {
      await expect(canvas.getByText("Toast title")).toBeInTheDocument();
      await expect(
        canvas.getByText("This is the toast description.")
      ).toBeInTheDocument();
    });
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
    await expect(
      await canvas.findByText("Your changes have been saved.")
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Warning toast" }));
    await expect(
      await canvas.findByText("Your session expires soon.")
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Error toast" }));
    await expect(await canvas.findByText("Something went wrong.")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "With action" }));
    await expect(
      await canvas.findByText("A new version is available.")
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Persistent toast" }));
    await expect(
      await canvas.findByText("This toast won't auto-dismiss (duration: 0).")
    ).toBeInTheDocument();
  },
};

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
/**
 * Each button fires a toast at that named position.
 * Note: a single <Toaster> handles one position. For multi-position support
 * you can mount multiple <Toaster> components with different positions.
 */
export const Positions: Story = {
  render: () => {
    const { createToast } = useToast();

    return (
      <>
        {POSITIONS.map(position => (
          <Button
            key={position}
            onClick={() =>
              createToast({
                title: position,
                description: `${position}-toast appear here.`,
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
  play: async ({ canvas, step }) => {
    for (const position of POSITIONS) {
      await step(`Create a toast at ${position}`, async () => {
        await userEvent.click(canvas.getByRole("button", { name: position }));
        await expect(
          await canvas.findByRole("button", { name: position })
        ).toBeInTheDocument();
        await expect(
          await canvas.findByText(`${position}-toast appear here.`)
        ).toBeInTheDocument();
      });
    }
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
