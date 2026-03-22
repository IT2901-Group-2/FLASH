import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";
import { expect, userEvent } from "storybook/test";

const meta: Meta<typeof Select> = {
  title: "Building Blocks/Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {},
  args: {},
  decorators: [
    Story => (
      <div style={{ width: "16rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select label="Sort by" defaultValue="name" required>
      <Select.Option value="name" label="Name" />
      <Select.Option value="startDate" label="Start Date" />
      <Select.Option value="endDate" label="End Date" />
      <Select.Option value="createdAt" label="Created At" />
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const user = userEvent.setup();
    const trigger = canvas.getByRole("combobox");
    const label = canvas.getByTestId("mainLabel");

    await step("Verify all elements precent", async () => {
      await expect(label).toBeVisible();
      await expect(label).toHaveTextContent("Sort by");

      await expect(trigger).toBeInTheDocument();
      await expect(trigger).toHaveTextContent("Name");
    });

    await step("Interactions", async () => {
      await expect(trigger).toHaveTextContent("Name");

      // Open the custom listbox and pick a new option
      await user.click(trigger);
      await user.click(canvas.getByRole("option", { name: "Start Date" }));
      await expect(trigger).toHaveTextContent("Start Date");

      // Open again and pick another
      await user.click(trigger);
      await user.click(canvas.getByRole("option", { name: "Created At" }));
      await expect(trigger).toHaveTextContent("Created At");
    });
  },
};

export const Small: Story = {
  render: () => (
    <Select label="Sort by" defaultValue="name" required size="small">
      <Select.Option value="name" label="Name" />
      <Select.Option value="startDate" label="Start Date" />
      <Select.Option value="endDate" label="End Date" />
      <Select.Option value="createdAt" label="Created At" />
    </Select>
  ),
  play: async ({ canvas }) => {
    const wrapper = canvas.getByTestId("select");
    await expect(wrapper).toHaveAttribute("data-size", "small");
  },
};

export const Description: Story = {
  render: () => (
    <Select
      label="Sort by"
      defaultValue="name"
      description="The order the events apear in"
    >
      <Select.Option value="name" label="Name" />
      <Select.Option value="startDate" label="Start Date" />
      <Select.Option value="endDate" label="End Date" />
      <Select.Option value="createdAt" label="Created At" />
    </Select>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("The order the events apear in")).toBeInTheDocument();
  },
};

export const Error: Story = {
  render: () => (
    <Select
      label="Sort by"
      defaultValue="name"
      description="The order the events apear in"
      error="You must choose an order"
    >
      <Select.Option value="name" label="Name" />
      <Select.Option value="startDate" label="Start Date" />
      <Select.Option value="endDate" label="End Date" />
      <Select.Option value="createdAt" label="Created At" />
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox");
    const wrapper = canvas.getByTestId("select");

    await expect(canvas.getByText("You must choose an order")).toBeInTheDocument();
    await expect(trigger).toHaveAttribute("aria-invalid", "true");
    await expect(wrapper).toHaveAttribute("data-error", "true");
  },
};

export const HideLabel: Story = {
  render: () => (
    <Select label="Sort by" defaultValue="name" hideLabel>
      <Select.Option value="name" label="Name" />
      <Select.Option value="startDate" label="Start Date" />
      <Select.Option value="endDate" label="End Date" />
      <Select.Option value="createdAt" label="Created At" />
    </Select>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByTestId("mainLabel");
    await expect(label).toBeInTheDocument();
    await expect(label).not.toBeVisible();
  },
};

export const Disabled: Story = {
  render: () => (
    <Select label="Sort by" defaultValue="name" disabled>
      <Select.Option value="name" label="Name" />
      <Select.Option value="startDate" label="Start Date" />
      <Select.Option value="endDate" label="End Date" />
      <Select.Option value="createdAt" label="Created At" />
    </Select>
  ),
  play: async ({ canvas, canvasElement }) => {
    const user = userEvent.setup();
    const trigger = canvas.getByRole("combobox");

    await expect(trigger).toBeDisabled();
    await user.click(trigger);
    const listbox = canvasElement.querySelector("[data-open]");
    await expect(listbox).toHaveAttribute("data-open", "false");
  },
};
