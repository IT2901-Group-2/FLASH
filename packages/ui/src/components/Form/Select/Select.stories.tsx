import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";
import { expect, userEvent } from "storybook/test";
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
};
