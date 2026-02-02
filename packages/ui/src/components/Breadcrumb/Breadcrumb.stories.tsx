import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "./Breadcrumb";
import { expect, within } from "storybook/test";

const meta: Meta<typeof Breadcrumb> = {
  title: "Byggeklosser/Komponenter/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    items: {
      description: "Array of breadcrumb items to display",
      control: "object",
    },
    className: {
      description: "Optional CSS class name for custom styling",
      control: "text",
    },
    "data-color": {
      description: "Overrides inherited color.",
      options: ["brand-purple", "accent", "success", "warning", "neutral"],
      control: "select",
    },
  },
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Breadcrumb renders with three items", async () => {
      const nav = canvas.getByRole("navigation", { name: /breadcrumb/i });
      const items = canvas.getAllByRole("listitem");

      await expect(nav).toBeInTheDocument();
      await expect(items).toHaveLength(3);
    });

    await step("Home icon is present in first item", async () => {
      const items = canvas.getAllByRole("listitem");
      const firstItemLink = items[0].querySelector("a");

      await expect(firstItemLink).toBeInTheDocument();
    });

    await step("Middle item is a clickable link", async () => {
      const items = canvas.getAllByRole("listitem");
      const middleLink = items[1].querySelector("a");

      await expect(middleLink).toBeInTheDocument();
      await expect(middleLink).toHaveAttribute("href", "/albums");
    });

    await step("Last item is current page text", async () => {
      const items = canvas.getAllByRole("listitem");
      const lastItem = items[2].querySelector("[aria-current=page]");

      await expect(lastItem).toBeInTheDocument();
    });
  },
};

export const TwoLevels: Story = {
  args: {
    items: [{ label: "", href: "/" }, { label: "Albums" }],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Breadcrumb renders with two items", async () => {
      const items = canvas.getAllByRole("listitem");

      await expect(items).toHaveLength(2);
    });

    await step("Second item is current page", async () => {
      const items = canvas.getAllByRole("listitem");
      const lastItem = items[1].querySelector("[aria-current=page]");

      await expect(lastItem).toBeInTheDocument();
    });
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Breadcrumb renders with multiple items", async () => {
      const items = canvas.getAllByRole("listitem");

      await expect(items).toHaveLength(4);
    });

    await step("All middle items are clickable links", async () => {
      const items = canvas.getAllByRole("listitem");

      const secondLink = items[1].querySelector("a");
      const thirdLink = items[2].querySelector("a");

      await expect(secondLink).toHaveAttribute("href", "/albums");
      await expect(thirdLink).toHaveAttribute("href", "/albums/main");
    });

    await step("Last item is current page", async () => {
      const items = canvas.getAllByRole("listitem");
      const lastItem = items[3].querySelector("[aria-current=page]");

      await expect(lastItem).toBeInTheDocument();
    });
  },
};
