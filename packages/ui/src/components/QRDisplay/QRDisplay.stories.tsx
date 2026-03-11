import type { Meta, StoryObj } from "@storybook/react-vite";
import QRDisplay from "./QRDisplay";
import { expect, within } from "storybook/test";

const meta: Meta<typeof QRDisplay> = {
  title: "Building Blocks/Components/QRDisplay",
  component: QRDisplay,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "text" } },
    code: { control: { type: "text" } },
    helperText: { control: { type: "text" } },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
  },
  decorators: [Story => <Story />],
} satisfies Meta<typeof QRDisplay>;

export default meta;
type Story = StoryObj<typeof QRDisplay>;

export const Default: Story = {
  args: {
    value: "https://example.com/upload/abc123",
    code: "ABC123",
    helperText: "Scan to upload photos",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const codeElement = canvas.getByText("ABC123");
    await expect(codeElement).toBeInTheDocument();

    const helperText = canvas.getByText("Scan to upload photos");
    await expect(helperText).toBeInTheDocument();

    const container = canvasElement.querySelector("div");
    const qrCode = container?.querySelector("svg");
    await expect(qrCode).toBeInTheDocument();
  },
};

export const WithoutCode: Story = {
  args: {
    value: "https://example.com/upload",
    helperText: "Scan to upload photos",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const helperText = canvas.getByText("Scan to upload photos");
    await expect(helperText).toBeInTheDocument();

    const container = canvasElement.querySelector("div");
    const qrCode = container?.querySelector("svg");
    await expect(qrCode).toBeInTheDocument();
  },
};

export const LongURL: Story = {
  args: {
    value: "https://example.com/upload/session/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    code: "SESSION-2024",
    helperText: "Scan to upload photos",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
      <QRDisplay
        value={"https://example.com/s1"}
        code="SM"
        helperText="Scan to upload photos"
        size="small"
      />
      <QRDisplay
        value={"https://example.com/m1"}
        code="MD"
        helperText="Scan to upload photos"
        size="medium"
      />
      <QRDisplay
        value={"https://example.com/l1"}
        code="LG"
        helperText="Scan to upload photos"
        size="large"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector("div");
    const svgs = container?.querySelectorAll("svg");
    await expect(svgs && svgs.length).toBe(3);
  },
};
