import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Byggeklosser/Komponenter/Breadcrumb",
  component: Breadcrumb,
  argTypes: {},
  decorators: [
    Story => (
      <div
        style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem" }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: "", href: "/" },
      { label: "Albums", href: "/albums" },
      { label: "Main Gallery" },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [{ label: "", href: "/" }, { label: "Albums" }],
  },
};

export const MultipleLevels: Story = {
  args: {
    items: [
      { label: "", href: "/" },
      { label: "Albums", href: "/albums" },
      { label: "Main Gallery", href: "/albums/main" },
      { label: "Photo Details" },
    ],
  },
};
