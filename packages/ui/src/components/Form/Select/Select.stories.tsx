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
