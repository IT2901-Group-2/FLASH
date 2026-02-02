import { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

export default {
  title: "Byggeklosser/Komponenter/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: {
        type: "radio",
      },
      options: ["medium", "small"],
    },
    position: {
      control: {
        type: "radio",
      },
      options: ["right", "left"],
    },
    description: {
      type: "string",
    },
    hideLabel: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
    loading: {
      type: "boolean",
    },
  },
  parameters: {
    chromatic: { disable: true },
  },
} satisfies Meta<typeof Switch>;

type Story = StoryObj<typeof Switch>;

export const Medium: Story = {
  args: {
    children: "Send Notifications",
  },
};

export const Small: Story = {
  args: {
    children: "Send Notifications",
    size: "small",
  },
};

export const Description: Story = {
  args: {
    children: "Send Notifications",
    description: "We send them between 08:00 and 17:00",
  },
};

export const HideLabel: Story = {
  args: {
    hideLabel: true,
  },
};

export const Right: Story = {
  args: {
    children: "Send Notifications",
    position: "right",
  },
};

export const Loading: Story = {
  render: () => {
    return (
      <>
        <Switch loading>Send Notifications</Switch>
        <Switch loading checked>
          Send Notifications
        </Switch>
      </>
    );
  },
};

export const ReadOnly: Story = {
  render: () => {
    return (
      <>
        <Switch readOnly>Send Notifications</Switch>
        <Switch readOnly checked>
          Send Notifications
        </Switch>
      </>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <>
        <Switch disabled>Send Notifications</Switch>
        <Switch disabled checked>
          Send Notifications
        </Switch>
      </>
    );
  },
};
