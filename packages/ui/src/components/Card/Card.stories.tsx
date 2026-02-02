import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { expect, within } from "storybook/test";
import { colorNames } from "@/styles/colorType";

const meta: Meta<typeof Card> = {
  title: "Byggeklosser/Komponenter/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    "data-color": {
      control: "select",
      options: colorNames,
    },
    children: { control: { type: "text" } },
  },
  decorators: [],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

/* Default Card story */
export const Default: Story = {
  args: {
    children: "This is a card",
  },
  play: async ({ canvas }) => {
    const card = canvas.getByText("This is a card");

    await expect(card).toBeInTheDocument();
  },
};

/* Test with multiple elements inside the Card */
export const WithContent: Story = {
  render: () => (
    <Card>
      <h2>Card Title</h2>
      <p>This card contains multiple elements of content.</p>
      <p>Try hovering over it to see the hover effect!</p>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Card renders with title", async () => {
      const title = canvas.getByText("Card Title");
      await expect(title).toBeInTheDocument();
    });

    await step("Card renders with paragraphs", async () => {
      const firstParagraph = canvas.getByText(/This card contains multiple elements/);
      const secondParagraph = canvas.getByText(/Try hovering over it/);
      await expect(firstParagraph).toBeInTheDocument();
      await expect(secondParagraph).toBeInTheDocument();
    });
  },
};

/* Test all color variants of the Card */
export const Colors: Story = {
  render: () => (
    <>
      <Card data-color="neutral">Neutral</Card>
      <Card data-color="brand-purple">Brand Purple</Card>
      <Card data-color="accent">Accent</Card>
      <Card data-color="success">Success</Card>
      <Card data-color="warning">Warning</Card>
      <Card data-color="background-secondary">Background Secondary</Card>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All color variants render", async () => {
      const neutral = canvas.getByText("Neutral");
      const brandPurple = canvas.getByText("Brand Purple");
      const accent = canvas.getByText("Accent");
      const success = canvas.getByText("Success");
      const warning = canvas.getByText("Warning");
      const backgroundSecondary = canvas.getByText("Background Secondary");

      await expect(neutral).toBeInTheDocument();
      await expect(brandPurple).toBeInTheDocument();
      await expect(accent).toBeInTheDocument();
      await expect(success).toBeInTheDocument();
      await expect(warning).toBeInTheDocument();
      await expect(backgroundSecondary).toBeInTheDocument();
    });

    await step("Cards have correct data-color attributes", async () => {
      const neutralCard = canvas.getByText("Neutral").closest("div");
      const brandPurpleCard = canvas.getByText("Brand Purple").closest("div");

      await expect(neutralCard).toHaveAttribute("data-color", "neutral");
      await expect(brandPurpleCard).toHaveAttribute("data-color", "brand-purple");
    });
  },
};
