import type { Meta, StoryObj } from "@storybook/react";
import { ProgressDot, ProgressDots } from "./ProgressDots";

const meta: Meta<typeof ProgressDots> = {
  title: "Byggeklosser/Komponenter/ProgressDots",
  component: ProgressDots,
  argTypes: {},
  decorators: [
    Story => (
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressDots>;

export default meta;
type Story = StoryObj<typeof ProgressDots>;

export const ProgressDot_Variations: Story = {
  render: () => (
    <>
      <ProgressDot text="1" />
      <ProgressDot text="1" disabled />
      <ProgressDot text="1" showLine />
      <ProgressDot text="1" showLine disabled />
      <ProgressDot text="1" showLine linePosition="left" />
      <ProgressDot text="1" showLine linePosition="left" disabled />
    </>
  ),
};

export const ProgressDot_Colors: Story = {
  render: () => (
    <>
      <ProgressDot data-color="accent" text="1" />
      <ProgressDot data-color="accent" text="1" disabled />
      <ProgressDot data-color="brand-purple" text="1" />
      <ProgressDot data-color="brand-purple" text="1" disabled />
      <ProgressDot data-color="success" text="1" />
      <ProgressDot data-color="success" text="1" disabled />
    </>
  ),
};
