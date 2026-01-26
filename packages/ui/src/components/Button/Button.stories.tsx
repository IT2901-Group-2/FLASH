import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { fn } from "storybook/test";
import { ArrowLeft, ArrowRight, GamepadDirectional } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Byggeklosser/Komponenter/Button",
  component: Button,
  argTypes: {},
  args: { onClick: fn() },
  decorators: [
    Story => (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Standard_Purple: Story = {
  render: () => (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </>
  ),
};

export const Accent: Story = {
  render: () => (
    <>
      <Button data-color="accent" variant="primary">
        Primary
      </Button>
      <Button data-color="accent" variant="secondary">
        Secondary
      </Button>
      <Button data-color="accent" variant="tertiary">
        Tertiary
      </Button>
    </>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Icon: Story = {
  render: () => (
    <>
      <Button icon={<ArrowLeft />} iconPosition="left" variant="primary">
        Left
      </Button>
      <Button icon={<GamepadDirectional />} />
      <Button icon={<ArrowRight />} iconPosition="right" variant="primary">
        Right
      </Button>
    </>
  ),
};

export const Disabled: Story = {
  render: () => (
    <>
      <Button disabled variant="primary">
        Primary
      </Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="tertiary">
        Tertiary
      </Button>
    </>
  ),
};
