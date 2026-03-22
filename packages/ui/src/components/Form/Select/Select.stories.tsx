import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";
// import { expect, userEvent } from "storybook/test";

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
  // play: async ({ canvas, step }) => {
  //   const select = canvas.getByRole("combobox");

  //   await step("renders label and select", async () => {
  //     expect(canvas.getByText("Sort by")).toBeInTheDocument();
  //     expect(select).toBeInTheDocument();
  //   });

  //   await step("can select an option", async () => {
  //     await userEvent.selectOptions(select, "startDate");
  //     expect(select).toHaveValue("startDate");
  //   });
  // },
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
  // play: async ({ canvas, step }) => {
  //   await step("renders description", async () => {
  //     expect(canvas.getByText("The order the events apear in")).toBeInTheDocument();
  //   });
  // },
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
  // play: async ({ canvas, step }) => {
  //   await step("renders error message", async () => {
  //     expect(canvas.getByText("You must choose an order")).toBeInTheDocument();
  //   });

  //   await step("select has invalid state", async () => {
  //     expect(canvas.getByRole("combobox")).toBeInvalid();
  //   });
  // },
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
  // play: async ({ canvas, step }) => {
  //   await step("label is visually hidden but accessible", async () => {
  //     const label = canvas.getByText("Sort by");
  //     expect(label).toBeInTheDocument();
  //     expect(label).not.toBeVisible();
  //   });
  // },
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
  // play: async ({ canvas, step }) => {
  //   const select = canvas.getByRole("combobox");

  //   await step("select is disabled", async () => {
  //     expect(select).toBeDisabled();
  //   });

  //   await step("cannot interact with disabled select", async () => {
  //     await userEvent.selectOptions(select, "startDate");
  //     expect(select).not.toHaveValue("startDate");
  //   });
  // },
};
