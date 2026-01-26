import type { Meta, StoryObj } from "@storybook/react";
import { Template } from "./Template";
import { fn } from "storybook/test";
import { ArrowLeft, ArrowRight, Circle, GamepadDirectional } from "lucide-react";
import { background } from "storybook/theming";

const meta: Meta<typeof Template> = {
  title: "Byggeklosser/Komponenter/Template",
  component: Template,
  argTypes: {},
  args: { onClick: fn() },
  decorators: [
    Story => (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof Template>;

export const Standard_Purple: Story = {
  render: () => (
    <>
      <Template />
    </>
  ),
};
