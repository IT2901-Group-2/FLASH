import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";

const meta: Meta<typeof Select> = {
  title: "Building Blocks/Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Size: Story = {
  render: () => (
    <Select label="Sort by">
      <option value="name">Event name</option>
      <option value="startDate">Start date</option>
      <option value="endDate">End date</option>
      <option value="createdAt">Created at</option>
    </Select>
  ),
};

export const Description: Story = {
  render: () => (
    <Select label="Sort by" description="The order the events apear in">
      <option value="name">Event name</option>
      <option value="startDate">Start date</option>
      <option value="endDate">End date</option>
      <option value="createdAt">Created at</option>
    </Select>
  ),
};

export const Error: Story = {
  render: () => (
    <Select
      label="Sort by"
      description="The order the events apear in"
      error="You must choose an order"
    >
      <option value="name">Event name</option>
      <option value="startDate">Start date</option>
      <option value="endDate">End date</option>
      <option value="createdAt">Created at</option>
    </Select>
  ),
};

export const HideLabel: Story = {
  render: () => (
    <Select label="Sort by" hideLabel>
      <option value="name">Event name</option>
      <option value="startDate">Start date</option>
      <option value="endDate">End date</option>
      <option value="createdAt">Created at</option>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select label="Sort by" disabled>
      <option value="name">Event name</option>
      <option value="startDate">Start date</option>
      <option value="endDate">End date</option>
      <option value="createdAt">Created at</option>
    </Select>
  ),
};
