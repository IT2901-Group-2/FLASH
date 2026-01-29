import type { Meta, StoryObj } from "@storybook/react";
import { Title } from "./Title";

const meta: Meta<typeof Title> = {
  title: "Byggeklosser/Komponenter/Title",
  tags: ["autodocs"],
  component: Title,
  argTypes: {},
  decorators: [
    Story => (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof Title>;

export const Standard_Purple: Story = {
  render: () => (
    <>
      <Title as="h1">This is an H1 title</Title>
      <Title as="h2">This is an H2 title</Title>
      <Title as="h3">This is an H3 title</Title>
    </>
  ),
};

export const Sizes: Story = {
  render: () => (
    <>
      <Title size="xlarge">Extra Large Title</Title>
      <Title size="large">Large Title</Title>
      <Title size="medium">Medium Title</Title>
      <Title size="small">Small Title</Title>
    </>
  ),
};

export const Weights: Story = {
  render: () => (
    <>
      <Title weight="bold">Bold Weight</Title>
      <Title weight="semibold">Semibold Weight</Title>
      <Title weight="medium">Medium Weight</Title>
    </>
  ),
};

export const Alignment: Story = {
  render: () => (
    <>
      <Title align="left">Left Aligned Title</Title>
      <Title align="center">Center Aligned Title</Title>
      <Title align="right">Right Aligned Title</Title>
    </>
  ),
};

export const Colors: Story = {
  render: () => (
    <>
      <Title data-color="brand-purple">Brand Purple</Title>
      <Title data-color="accent">Accent Color</Title>
      <Title data-color="neutral">Neutral Color</Title>
    </>
  ),
};

export const SemanticVsVisual: Story = {
  render: () => (
    <>
      <Title as="h1" size="small">
        H1 but visually small
      </Title>
      <Title as="h3" size="xlarge">
        H3 but visually extra large
      </Title>
      <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.875rem" }}>
        This demonstrates how semantic level (as) can be independent from visual size
      </p>
    </>
  ),
};

export const Combined: Story = {
  render: () => (
    <>
      <Title as="h1" size="xlarge" weight="bold" align="center" data-color="accent">
        Feature Title with All Props
      </Title>
    </>
  ),
};
