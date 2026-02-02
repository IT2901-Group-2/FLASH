import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader } from "./Loader";
import { fn } from "storybook/test";

const meta: Meta<typeof Loader> = {
  title: "Byggeklosser/Komponenter/Loader",
  tags: ["autodocs"],
  component: Loader,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: { control: "radio" },
    title: { control: "text" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof Loader>;

export const Neutral: Story = {
  args: {
    variant: "neutral",
    size: "3xlarge",
  },
};

export const Interaction: Story = {
  args: {
    variant: "interaction",
    size: "3xlarge",
  },
};

export const Transparent: Story = {
  args: {
    transparent: true,
    size: "3xlarge",
  },
};

export const Size: Story = {
  render: () => (
    <>
      <Loader size="3xlarge" title="Waiting..." />
      <Loader size="2xlarge" title="Waiting..." />
      <Loader size="xlarge" title="Waiting..." />
      <Loader size="large" title="Waiting..." />
      <Loader size="medium" title="Waiting..." />
      <Loader size="small" title="Waiting..." />
      <Loader size="xsmall" title="Waiting..." />
    </>
  ),
};
