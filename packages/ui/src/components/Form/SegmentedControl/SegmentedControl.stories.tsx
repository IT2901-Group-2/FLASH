import type { Meta, StoryObj } from "@storybook/react-vite";
import SegmentedControl from "./SegmentedControl";
import { TextAlignCenter, TextAlignEnd, TextAlignStart } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof SegmentedControl> = {
  title: "Building Blocks/Components/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [
    Story => (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "30rem",
        }}
      >
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
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const ItemLabel: Story = {
  render: () => (
    <SegmentedControl defaultValue="center" onChange={console.log}>
      <SegmentedControl.Item value="left" label="Left" />
      <SegmentedControl.Item value="center" label="Center" />
      <SegmentedControl.Item value="right" label="Right" />
    </SegmentedControl>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const left = canvas.getByRole("radio", { name: "Left" });
    const center = canvas.getByRole("radio", { name: "Center" });
    const right = canvas.getByRole("radio", { name: "Right" });

    await step("have correct content", async () => {
      expect(left).toBeInTheDocument();
      expect(center).toBeInTheDocument();
      expect(right).toBeInTheDocument();

      expect(center).toBeChecked();

      await userEvent.click(left);
    });

    await step("be keyboard interactable", async () => {
      left.focus();
      expect(left).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      expect(center).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      expect(right).toHaveFocus();

      await userEvent.keyboard("{ArrowLeft}");
      expect(center).toHaveFocus();

      await userEvent.keyboard("{Home}");
      expect(left).toHaveFocus();

      await userEvent.keyboard("{End}");
      expect(right).toHaveFocus();
    });
  },
};

export const GroupLabel: Story = {
  render: () => (
    <SegmentedControl
      defaultValue="center"
      onChange={console.log}
      label="Select"
      description="Example description"
    >
      <SegmentedControl.Item value="left" label="Left" />
      <SegmentedControl.Item value="center" label="Center" />
      <SegmentedControl.Item value="right" label="Right" />
    </SegmentedControl>
  ),
};

export const Size: Story = {
  render: () => (
    <>
      <SegmentedControl
        defaultValue="center"
        onChange={console.log}
        data-testid="segmentedControl"
      >
        <SegmentedControl.Item value="left" label="Left" icon={<TextAlignStart />} />
        <SegmentedControl.Item value="center" label="Center" icon={<TextAlignCenter />} />
        <SegmentedControl.Item value="right" label="Right" icon={<TextAlignEnd />} />
      </SegmentedControl>
      <SegmentedControl
        size="small"
        defaultValue="center"
        onChange={console.log}
        data-testid="segmentedControl"
      >
        <SegmentedControl.Item value="left" label="Left" icon={<TextAlignStart />} />
        <SegmentedControl.Item value="center" label="Center" icon={<TextAlignCenter />} />
        <SegmentedControl.Item value="right" label="Right" icon={<TextAlignEnd />} />
      </SegmentedControl>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const segmentedControls = canvas.getAllByTestId("segmentedControl");
    expect(segmentedControls).toHaveLength(2);
  },
};

export const Colors: Story = {
  render: () => (
    <SegmentedControl
      defaultValue="center"
      onChange={console.log}
      data-color="brand-purple"
      data-testid="segmentedControl"
    >
      <SegmentedControl.Item value="left" label="Left" icon={<TextAlignStart />} />
      <SegmentedControl.Item value="center" label="Center" icon={<TextAlignCenter />} />
      <SegmentedControl.Item value="right" label="Right" icon={<TextAlignEnd />} />
    </SegmentedControl>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const segmentedControl = canvas.getByTestId("segmentedControl");
    expect(segmentedControl).toHaveAttribute("data-color", "brand-purple");
    expect(canvas.getByRole("radio", { name: "Center" })).toBeChecked();
  },
};

export const Fill: Story = {
  render: () => (
    <SegmentedControl defaultValue="center" onChange={console.log} fill>
      <SegmentedControl.Item value="left" label="Left" />
      <SegmentedControl.Item value="center" label="Center" />
      <SegmentedControl.Item value="right" label="Right" />
    </SegmentedControl>
  ),
};
