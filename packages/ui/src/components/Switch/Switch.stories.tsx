import { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";

const DISPLAY_TEXT: string = "Send Notifications";
const DISPLAY_DESCRIPTION: string = "We send them between 08:00 and 17:00";

const meta: Meta<typeof Switch> = {
  title: "Byggeklosser/Komponenter/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["medium", "small"],
    },
    position: {
      control: { type: "radio" },
      options: ["right", "left"],
    },
    description: { type: "string" },
    hideLabel: { type: "boolean" },
    disabled: { type: "boolean" },
    loading: { type: "boolean" },
  },
  parameters: {
    chromatic: { disable: true },
  },
} satisfies Meta<typeof Switch>;
export default meta;

type Story = StoryObj<typeof Switch>;

export const Medium: Story = {
  args: {
    children: DISPLAY_TEXT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchLabel = canvas.getByText(DISPLAY_TEXT);
    expect(switchLabel).toBeInTheDocument();

    const switchInput = canvas.getByRole("switch");
    expect(switchInput).toBeInTheDocument();

    expect(switchInput).not.toBeChecked();

    await userEvent.click(switchInput);
    expect(switchInput).toBeChecked();

    await userEvent.click(switchInput);
    expect(switchInput).not.toBeChecked();
  },
};

export const Small: Story = {
  args: {
    children: DISPLAY_TEXT,
    size: "small",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchInput = canvas.getByRole("switch");
    expect(switchInput).toBeInTheDocument();

    expect(canvas.getByText(DISPLAY_TEXT)).toBeInTheDocument();

    await userEvent.click(switchInput);
    expect(switchInput).toBeChecked();
  },
};

export const Description: Story = {
  args: {
    children: DISPLAY_TEXT,
    description: DISPLAY_DESCRIPTION,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(DISPLAY_TEXT)).toBeInTheDocument();

    expect(canvas.getByText(DISPLAY_DESCRIPTION)).toBeInTheDocument();

    const switchInput = canvas.getByRole("switch");
    await userEvent.click(switchInput);
    expect(switchInput).toBeChecked();
  },
};

export const HideLabel: Story = {
  args: {
    children: DISPLAY_TEXT,
    hideLabel: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchInput = canvas.getByRole("switch");
    expect(switchInput).toBeInTheDocument();

    expect(switchInput).not.toHaveAccessibleName(DISPLAY_TEXT);

    await userEvent.click(switchInput);
    expect(switchInput).toBeChecked();
  },
};

export const Right: Story = {
  args: {
    children: DISPLAY_TEXT,
    position: "right",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchInput = canvas.getByRole("switch");
    expect(switchInput).toBeInTheDocument();
    expect(canvas.getByText(DISPLAY_TEXT)).toBeInTheDocument();

    await userEvent.click(switchInput);
    expect(switchInput).toBeChecked();
  },
};

export const ControlledValue: Story = {
  render: () => {
    const [checked, setChecked] = useState<boolean>(false);

    return (
      <Switch value="sms" checked={checked} onChange={e => setChecked(e.target.checked)}>
        Varsle med SMS
      </Switch>
    );
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switches = canvas.getAllByRole("switch");
    expect(switches).toHaveLength(2);

    expect(switches[0]).not.toBeChecked();
    expect(switches[1]).toBeChecked();

    switches.forEach(switchInput => {
      const isDisabled = switchInput.hasAttribute("disabled");
      expect(isDisabled).toBe(true);
    });
  },
};

export const Readonly: Story = {
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switches = canvas.getAllByRole("switch");
    expect(switches).toHaveLength(2);

    expect(switches[0]).not.toBeChecked();
    expect(switches[1]).toBeChecked();

    const uncheckedSwitch = switches[0];
    const checkedSwitch = switches[1];

    await userEvent.click(uncheckedSwitch);
    expect(uncheckedSwitch).not.toBeChecked();

    await userEvent.click(checkedSwitch);
    expect(checkedSwitch).toBeChecked();
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switches = canvas.getAllByRole("switch");
    expect(switches).toHaveLength(2);

    switches.forEach(switchInput => {
      expect(switchInput).toBeDisabled();
    });

    expect(switches[0]).not.toBeChecked();
    expect(switches[1]).toBeChecked();

    await userEvent.click(switches[0]);
    expect(switches[0]).not.toBeChecked();

    await userEvent.click(switches[1]);
    expect(switches[1]).toBeChecked();
  },
};
