import type { Meta, StoryObj } from "@storybook/react-vite";
import SegmentedControl from "./SegmentedControl";
import { TextAlignCenter, TextAlignEnd, TextAlignStart } from "lucide-react";

const meta: Meta<typeof SegmentedControl> = {
  title: "Building Blocks/Components/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const ItemLabel: Story = {
  render: () => (
    <SegmentedControl onChange={console.log}>
      <SegmentedControl.Item value="left" label="Left" />
      <SegmentedControl.Item value="center" label="Center" />
      <SegmentedControl.Item value="right" label="Right" />
    </SegmentedControl>
  ),
};

export const GroupLabel: Story = {
  render: () => (
    <SegmentedControl onChange={console.log} label="Select">
      <SegmentedControl.Item value="left" label="Left" />
      <SegmentedControl.Item value="center" label="Center" />
      <SegmentedControl.Item value="right" label="Right" />
    </SegmentedControl>
  ),
};

export const Size: Story = {
  render: () => (
    <SegmentedControl onChange={console.log}>
      <SegmentedControl.Item value="left" label="Left" icon={<TextAlignStart />} />
      <SegmentedControl.Item value="center" label="Center" icon={<TextAlignCenter />} />
      <SegmentedControl.Item value="right" label="Right" icon={<TextAlignEnd />} />
    </SegmentedControl>
  ),
};

export const Colors: Story = {
  render: () => (
    <SegmentedControl onChange={console.log} data-color="brand-purple">
      <SegmentedControl.Item value="left" label="Left" icon={<TextAlignStart />} />
      <SegmentedControl.Item value="center" label="Center" icon={<TextAlignCenter />} />
      <SegmentedControl.Item value="right" label="Right" icon={<TextAlignEnd />} />
    </SegmentedControl>
  ),
};

export const Fill: Story = {
  render: () => (
    <div style={{ width: "30rem" }}>
      <SegmentedControl onChange={console.log} fill>
        <SegmentedControl.Item value="left" label="Left" />
        <SegmentedControl.Item value="center" label="Center" />
        <SegmentedControl.Item value="right" label="Right" />
      </SegmentedControl>
    </div>
  ),
};
