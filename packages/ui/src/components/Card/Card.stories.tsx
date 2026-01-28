import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Byggeklosser/Komponenter/Card",
  component: Card,
  argTypes: {
    variant: { control: "radio" },
  },
  decorators: [
    Story => (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "This is a primary card",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "This is a secondary card",
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
    children: "This is a dark mode card",
  },
};

export const WithContent: Story = {
  render: () => (
    <Card variant="primary">
      <h2>Card Title</h2>
      <p>This card contains multiple elements of content.</p>
      <p>Try hovering over it to see the hover effect!</p>
    </Card>
  ),
};

export const DarkWithContent: Story = {
  render: () => (
    <Card variant="dark">
      <h2>Dark Card Title</h2>
      <p>This is a dark variant card with light text.</p>
      <p>Perfect for creating visual contrast in your layouts!</p>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <>
      <Card variant="primary">Primary variant</Card>
      <Card variant="secondary">Secondary variant</Card>
      <Card variant="dark">Dark variant</Card>
    </>
  ),
};
