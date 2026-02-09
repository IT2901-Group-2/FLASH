import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownControls } from "./DropdownControls";
import { expect, userEvent, within } from "storybook/test";
import { colorNames } from "@/styles/colorType";
import { useState } from "react";

const meta: Meta<typeof DropdownControls> = {
  title: "Building Blocks/Components/DropdownControls",
  component: DropdownControls,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "tertiary"] },
    "data-color": { control: "select", options: colorNames },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof DropdownControls>;

export default meta;
type Story = StoryObj<typeof DropdownControls>;

const EnableDisable = [
  { value: "enable", label: "Enable", content: <p>Additional content is visible.</p> },
  { value: "disable", label: "Disable" },
] as const;

const ThreeOptions = [
  {
    value: "details",
    label: "Details",
    content: <p>Details content is visible.</p>,
  },
  {
    value: "settings",
    label: "Settings",
    content: <p>Settings content is visible.</p>,
  },
  {
    value: "help",
    label: "Help",
    content: <p>Help content is visible.</p>,
  },
] as const;

// Basic State Test
export const Basic: Story = {
  args: {
    options: EnableDisable,
    defaultValue: "disable",
    "data-color": "accent",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Verify initial state", async () => {
      expect(canvas.getByText("Disable")).toBeInTheDocument();
      expect(
        canvas.queryByText("Additional content is visible.")
      ).not.toBeInTheDocument();

      const region = canvas.getByRole("region");
      const active = canvas.getByRole("radio", { name: /disable/i });
      await expect(region).toHaveAttribute("aria-labelledby", active.getAttribute("id"));
    });

    await step("Select 'Enable' option", async () => {
      const enableButton = canvas.getByRole("radio", { name: /enable/i });
      await user.click(enableButton);
      expect(canvas.getByText("Additional content is visible.")).toBeInTheDocument();

      const region = canvas.getByRole("region");
      await expect(region).toHaveAttribute(
        "aria-labelledby",
        enableButton.getAttribute("id")
      );
    });
  },
};

// Dropdown w/Input Test
export const WithInput: Story = {
  render: () => {
    const [text, setText] = useState("");

    const OptionsWithInput = [
      {
        value: "limit",
        label: "Limit",
        content: (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>Set maximum uploads to:</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "2rem",
                padding: "0 0.75rem",
                border: "1px solid var(--color-text)",
                borderRadius: "1.5rem",
                background: "var(--color-surface)",
              }}
            >
              <input
                aria-label="limit-input"
                value={text}
                onChange={e => setText(e.currentTarget.value)}
                style={{
                  width: "6rem",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "var(--color-text)",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              />
            </div>
          </div>
        ),
      },
      { value: "unlimited", label: "Unlimited" },
    ] as const;

    return (
      <DropdownControls
        options={OptionsWithInput}
        defaultValue="unlimited"
        variant="primary"
        data-color="accent"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Default option is selected", async () => {
      const unlimited = canvas.getByRole("radio", { name: /unlimited/i });
      await expect(unlimited).toHaveAttribute("aria-checked", "true");
    });

    await step("Input is hidden until Limit is selected", async () => {
      await expect(canvas.queryByLabelText("limit-input")).not.toBeInTheDocument();
    });

    await step("Limit option shows input and accepts typing", async () => {
      const limit = canvas.getByRole("radio", { name: /^limit$/i });
      await user.click(limit);

      const input = canvas.getByLabelText("limit-input");
      await user.type(input, "10");
      await expect(input).toHaveValue("10");
    });
  },
};

// Multiple Dropdown Options Test
export const MultipleOptions: Story = {
  args: {
    options: ThreeOptions,
    defaultValue: "details",
    variant: "primary",
    "data-color": "accent",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders three options", async () => {
      const radios = canvas.getAllByRole("radio");
      await expect(radios).toHaveLength(3);
    });

    await step("Shows content for default option", async () => {
      await expect(canvas.getByText("Details content is visible.")).toBeInTheDocument();

      const active = canvas.getByRole("radio", { name: /details/i });
      const region = canvas.getByRole("region");
      await expect(region).toHaveAttribute("aria-labelledby", active.getAttribute("id"));
    });
  },
};

// Controlled Value Update Test
export const ControlledValueUpdate: Story = {
  render: () => {
    const [value, setValue] = useState<"enable" | "disable">("disable");

    return (
      <div>
        <DropdownControls
          options={EnableDisable}
          value={value}
          onChange={setValue}
          variant="primary"
          data-color="accent"
        />
        <button type="button" onClick={() => setValue("enable")}>
          Set Enable
        </button>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Initial selection is Disable", async () => {
      const disable = canvas.getByRole("radio", { name: /disable/i });
      await expect(disable).toHaveAttribute("aria-checked", "true");
    });

    await step("External value update changes selection", async () => {
      const setEnable = canvas.getByRole("button", { name: /set enable/i });
      await user.click(setEnable);

      const enable = canvas.getByRole("radio", { name: /enable/i });
      await expect(enable).toHaveAttribute("aria-checked", "true");
    });
  },
};
