import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Byggeklosser/Komponenter/Card",
  component: Card,
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
    children: "This",
  },
};

export const WithContent: Story = {
  render: () => (
    <Card>
      <h2>Card Title</h2>
      <p>This card contains multiple elements of content.</p>
      <p>Try hovering over it to see the hover effect!</p>
    </Card>
  ),
};
