import type { Meta, StoryObj } from "@storybook/react";
import { ProgressDot, ProgressDots } from "./ProgressDots";
import { colorNames } from "@/styles/colorType";

const meta: Meta<typeof ProgressDots> = {
  title: "Byggeklosser/Komponenter/ProgressDots",
  component: ProgressDots,
  tags: ["autodocs"],
  argTypes: {
    maxValue: { control: { type: "number", min: 2, max: 10, step: 1 } },
    value: { control: { type: "number", min: 0, max: 10, step: 1 } },
    "data-color": { control: "select", options: colorNames },
  },
  decorators: [Story => <Story />],
} satisfies Meta<typeof ProgressDots>;

export default meta;
type Story = StoryObj<typeof ProgressDots>;

export const ProgressDot_Variations: Story = {
  args: {
    maxValue: 5,
  },
};
