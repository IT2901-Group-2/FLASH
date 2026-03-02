import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModerateHeader } from "./ModerateHeader";
import { expect, fn, userEvent, within } from "storybook/test";
import { useState } from "react";

const meta: Meta<typeof ModerateHeader> = {
  title: "Building Blocks/Components/ModerateHeader",
  component: ModerateHeader,
  tags: ["autodocs"],
  argTypes: {
    selectMode: {
      control: "boolean",
      description: "Whether the page is in multi-select mode.",
    },
    onBack: {
      description: "Callback invoked when the back arrow is clicked.",
    },
    onSelectToggle: {
      description: "Toggles between Select and Cancel mode.",
    },
    onSelectAll: {
      description: "Selects all images in the active tab.",
    },
    breadcrumbItems: {
      description: "Breadcrumb items for the mobile bottom bar.",
    },
  },
  decorators: [
    Story => (
      <div style={{ minWidth: "320px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ModerateHeader>;

export default meta;
type Story = StoryObj<typeof ModerateHeader>;

/* Default state — not in select mode */
export const Default: Story = {
  args: {
    onBack: fn(),
    selectMode: false,
    onSelectToggle: fn(),
    onSelectAll: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Both mobile and desktop layouts are in the DOM — use getAllByRole
    await expect(canvas.getByRole("banner")).toBeInTheDocument();
    await expect(
      canvas.getAllByRole("heading", { name: /moderate/i }).length
    ).toBeGreaterThan(0);
    await expect(
      canvas.getAllByRole("button", { name: /go back/i }).length
    ).toBeGreaterThan(0);
    await expect(
      canvas.getAllByRole("button", { name: /select$/i }).length
    ).toBeGreaterThan(0);
    await expect(canvas.queryAllByRole("button", { name: /select all/i })).toHaveLength(
      0
    );

    await userEvent.click(canvas.getAllByRole("button", { name: /go back/i })[0]);
    await expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};

/* Select mode — shows Cancel and Select All buttons */
export const SelectMode: Story = {
  args: {
    onBack: fn(),
    selectMode: true,
    onSelectToggle: fn(),
    onSelectAll: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getAllByRole("button", { name: /cancel/i }).length
    ).toBeGreaterThan(0);
    await expect(
      canvas.getAllByRole("button", { name: /select all/i }).length
    ).toBeGreaterThan(0);

    await userEvent.click(canvas.getAllByRole("button", { name: /select all/i })[0]);
    await expect(args.onSelectAll).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getAllByRole("button", { name: /cancel/i })[0]);
    await expect(args.onSelectToggle).toHaveBeenCalledTimes(1);
  },
};

/* Interactive — toggle between Select and Cancel mode in-story */
export const Interactive: Story = {
  render: () => {
    const [selectMode, setSelectMode] = useState(false);
    return (
      <ModerateHeader
        onBack={fn()}
        selectMode={selectMode}
        onSelectToggle={() => setSelectMode(prev => !prev)}
        onSelectAll={fn()}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step("Initially shows Select button", async () => {
      await expect(
        canvas.getAllByRole("button", { name: /select$/i }).length
      ).toBeGreaterThan(0);
      await expect(canvas.queryAllByRole("button", { name: /cancel/i })).toHaveLength(0);
    });

    await step("Clicking Select switches to Cancel + Select All", async () => {
      await user.click(canvas.getAllByRole("button", { name: /select$/i })[0]);
      await expect(
        canvas.getAllByRole("button", { name: /cancel/i }).length
      ).toBeGreaterThan(0);
      await expect(
        canvas.getAllByRole("button", { name: /select all/i }).length
      ).toBeGreaterThan(0);
    });

    await step("Clicking Cancel reverts to Select", async () => {
      await user.click(canvas.getAllByRole("button", { name: /cancel/i })[0]);
      await expect(
        canvas.getAllByRole("button", { name: /select$/i }).length
      ).toBeGreaterThan(0);
      await expect(canvas.queryAllByRole("button", { name: /cancel/i })).toHaveLength(0);
    });
  },
};

/* Mobile viewport — shows breadcrumb in default mode */
export const MobileDefault: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    onBack: fn(),
    selectMode: false,
    onSelectToggle: fn(),
    onSelectAll: fn(),
    breadcrumbItems: [{ label: "", href: "/" }, { label: "Moderate" }],
  },
};

/* Mobile viewport — select mode hides breadcrumb */
export const MobileSelectMode: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    onBack: fn(),
    selectMode: true,
    onSelectToggle: fn(),
    onSelectAll: fn(),
    breadcrumbItems: [{ label: "", href: "/" }, { label: "Moderate" }],
  },
};
