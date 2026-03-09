import type { Meta, StoryObj } from "@storybook/react-vite";
import DropdownControl from "./DropdownControl";
import { useState } from "react";
import { Input } from "../Form/TextField";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../Button";

const meta: Meta<typeof DropdownControl> = {
  title: "Building Blocks/Components/DropdownControl",
  component: DropdownControl,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [
    Story => (
      <div style={{ width: "30rem" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      source: {
        type: "dynamic",
      },
    },
  },
} satisfies Meta<typeof DropdownControl>;

export default meta;
type Story = StoryObj<typeof DropdownControl>;

export const Basic: Story = {
  render: () => (
    <DropdownControl defaultValue="disable" onChange={console.log}>
      <DropdownControl.Item
        value="enable"
        label="Enable"
        content={<p>Additional content is visible.</p>}
      />
      <DropdownControl.Item value="disable" label="Disable" />
    </DropdownControl>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const enableButton = canvas.getByRole("radio", { name: /enable/i });
    const disableButton = canvas.getByRole("radio", { name: /disable/i });

    await step("Verify initial state", async () => {
      expect(canvas.getByText("Disable")).toBeInTheDocument();
      expect(disableButton).toHaveAttribute("aria-checked", "true");
      expect(
        canvas.queryByText("Additional content is visible.")
      ).not.toBeInTheDocument();
    });

    await step("Select 'Enable' option", async () => {
      await userEvent.click(enableButton);
      expect(enableButton).toHaveFocus();
      expect(canvas.queryByText("Additional content is visible.")).toBeInTheDocument();
    });
  },
};

export const WithInput: Story = {
  render: () => {
    const [text, setText] = useState("");

    return (
      <DropdownControl defaultValue="unlimited" onChange={console.log}>
        <DropdownControl.Item
          value="limit"
          label="Limit"
          content={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "space-between",
              }}
            >
              <span>Set maximum uploads to:</span>
              <Input
                aria-label="limit-input"
                value={text}
                onChange={e => setText(e.currentTarget.value)}
              />
            </div>
          }
        />
        <DropdownControl.Item value="unlimited" label="Unlimited" />
      </DropdownControl>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const unlimited = canvas.getByRole("radio", { name: /unlimited/i });
    const limit = canvas.getByRole("radio", { name: /^limit$/i });

    await step("Default option is selected", async () => {
      await expect(unlimited).toHaveAttribute("aria-checked", "true");
    });

    await step("Input is hidden until Limit is selected", async () => {
      await expect(canvas.queryByLabelText("limit-input")).not.toBeInTheDocument();
    });

    await step("Limit option shows input and accepts typing", async () => {
      await user.click(limit);

      const input = canvas.getByLabelText("limit-input");
      await user.type(input, "10");
      await expect(input).toHaveValue("10");
    });
  },
};

export const MultipleOptions: Story = {
  render: () => (
    <DropdownControl defaultValue="details" onChange={console.log}>
      <DropdownControl.Item
        value="details"
        label="Details"
        content={<p>Details content is visible.</p>}
      />
      <DropdownControl.Item
        value="settings"
        label="Settings"
        content={<p>Settings content is visible.</p>}
      />
      <DropdownControl.Item
        value="help"
        label="Help"
        content={<p>Help content is visible.</p>}
      />
    </DropdownControl>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const details = canvas.getByRole("radio", { name: /details/i });
    const settings = canvas.getByRole("radio", { name: /settings/i });
    const help = canvas.getByRole("radio", { name: /help/i });

    await step("Renders three options", async () => {
      const radios = canvas.getAllByRole("radio");
      await expect(radios).toHaveLength(3);
    });

    await step("Shows content for default option", async () => {
      await expect(details).toBeInTheDocument();
      await expect(details).toHaveAttribute("aria-checked", "true");
    });

    await step("Shows content for settings option", async () => {
      await userEvent.click(settings);
      await expect(canvas.getByText("Settings content is visible.")).toBeInTheDocument();
      await expect(settings).toHaveAttribute("aria-checked", "true");
    });

    await step("Shows content for help option", async () => {
      await userEvent.click(help);
      await expect(canvas.getByText("Help content is visible.")).toBeInTheDocument();
      await expect(help).toHaveAttribute("aria-checked", "true");
    });
  },
};

export const ControlledValueUpdate: Story = {
  render: () => {
    const [value, setValue] = useState<string>("disable");

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <DropdownControl value={value} onChange={setValue}>
          <DropdownControl.Item
            value="enable"
            label="Enable"
            content={<p>Additional content is visible.</p>}
          />
          <DropdownControl.Item value="disable" label="Disable" />
        </DropdownControl>
        <Button type="button" onClick={() => setValue("enable")}>
          Set Enable
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const setEnabledButton = canvas.getByRole("button", { name: /set enable/i });

    await step("Initial selection is Disable", async () => {
      const disable = canvas.getByRole("radio", { name: /disable/i });
      await expect(disable).toHaveAttribute("aria-checked", "true");
    });

    await step("External value update changes selection", async () => {
      await userEvent.click(setEnabledButton);

      const enable = canvas.getByRole("radio", { name: /enable/i });
      await expect(enable).toHaveAttribute("aria-checked", "true");
      await expect(
        canvas.getByText("Additional content is visible.")
      ).toBeInTheDocument();
    });
  },
};
