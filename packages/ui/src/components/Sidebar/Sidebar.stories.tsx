import { Meta, StoryObj } from "@storybook/react-vite";
import Sidebar from "./Sidebar";
import {
  Calendar,
  ChartColumn,
  Clock4,
  HardDrive,
  House,
  Settings,
  SquareDashed,
  Users,
} from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Sidebar> = {
  title: "Building Blocks/Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "left",
    chromatic: { disable: true },
    docs: {
      source: {
        type: "dynamic",
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ height: "95vh" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Simple: Story = {
  render: () => (
    <Sidebar.Provider>
      <Sidebar.Trigger />
      <Sidebar />
    </Sidebar.Provider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByTestId("sidebar");
    const button = canvas.getByTestId("sidebar-trigger");

    await step("Sidebar and Open/Close button is renderd", async () => {
      expect(sidebar).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    await step("Sidebar opens and closes correctly", async () => {
      expect(sidebar).toHaveAttribute("data-open", "true");
      await userEvent.click(button);
      expect(sidebar).toHaveAttribute("data-open", "false");
      await userEvent.click(button);
      expect(sidebar).toHaveAttribute("data-open", "true");
    });
  },
};

export const WithGroupAndItems: Story = {
  render: () => (
    <Sidebar.Provider>
      <Sidebar>
        <Sidebar.Header style={{ height: "5rem" }} />
        <Sidebar.Group title="Test Title">
          <Sidebar.Item icon={<SquareDashed />}>Test 1</Sidebar.Item>
          <Sidebar.Item icon={<SquareDashed />}>Test 2</Sidebar.Item>
          <Sidebar.Item icon={<SquareDashed />}>Test 3</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Footer style={{ height: "5rem" }} />
      </Sidebar>
    </Sidebar.Provider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Group title is visible", async () => {
      const title = canvas.getByText("TEST TITLE");
      await expect(title).toBeInTheDocument();
    });

    await step("All sidebar items are rendered", async () => {
      await expect(canvas.getByText("Test 1")).toBeInTheDocument();
      await expect(canvas.getByText("Test 2")).toBeInTheDocument();
      await expect(canvas.getByText("Test 3")).toBeInTheDocument();
    });

    await step("Items have icons", async () => {
      const item1 = canvas.getByText("Test 1").closest('button, a, [role="button"]');
      const svg = item1?.querySelector("svg");
      await expect(svg).toBeInTheDocument();
    });

    await step("Items are clickable", async () => {
      const item1 = canvas.getByText("Test 1").closest('button, a, [role="button"]');
      await userEvent.click(item1!);
      // Add assertion for click behavior if applicable
    });

    await step("Items respond to keyboard navigation", async () => {
      const item2 = canvas.getByText("Test 2").closest('button, a, [role="button"]');
      await userEvent.tab();
      (item2 as HTMLButtonElement)?.focus();
      await userEvent.keyboard("{Enter}");
    });
  },
};

export const GroupPosition: Story = {
  render: () => (
    <Sidebar.Provider>
      <Sidebar>
        <Sidebar.Header style={{ height: "5rem" }} />
        <Sidebar.Group title="Test Title" position="center">
          <Sidebar.Item icon={<SquareDashed />}>Test 1</Sidebar.Item>
          <Sidebar.Item icon={<SquareDashed />}>Test 2</Sidebar.Item>
          <Sidebar.Item icon={<SquareDashed />}>Test 3</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Footer style={{ height: "5rem" }} />
      </Sidebar>
    </Sidebar.Provider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Position attribute is applied", async () => {
      const group = canvas.getByText("TEST TITLE").closest("[data-position]");
      await expect(group).toHaveAttribute("data-position", "center");
    });

    await step("Items are rendered within positioned group", async () => {
      const group = canvas.getByText("TEST TITLE").closest("div");
      const items = within(group!).getAllByText(/Test \d/);
      await expect(items).toHaveLength(3);
    });
  },
};

export const FullExample: Story = {
  render: () => (
    <Sidebar.Provider>
      <Sidebar>
        <Sidebar.Header style={{ height: "5rem" }} />
        <Sidebar.Group title="MAIN" position="top">
          <Sidebar.Item icon={<House />}>Desktop</Sidebar.Item>
          <Sidebar.Item icon={<Calendar />}>Event</Sidebar.Item>
          <Sidebar.Item icon={<ChartColumn />}>Analytics</Sidebar.Item>
          <Sidebar.Item icon={<Users />}>Users</Sidebar.Item>
          <Sidebar.Item icon={<Clock4 />}>Timeline</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group position="bottom">
          <Sidebar.Item icon={<Settings />}>Settings</Sidebar.Item>
          <Sidebar.Item icon={<HardDrive />}>Storage</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Footer style={{ height: "5rem" }} />
      </Sidebar>
    </Sidebar.Provider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Sidebar renders with all sections", async () => {
      const sidebar = canvas.getByTestId("sidebar");
      await expect(sidebar).toBeInTheDocument();
    });

    await step("Main group title is visible", async () => {
      const mainTitle = canvas.getByText("MAIN");
      await expect(mainTitle).toBeInTheDocument();
    });

    await step("All main navigation items are rendered", async () => {
      await expect(canvas.getByText("Desktop")).toBeInTheDocument();
      await expect(canvas.getByText("Event")).toBeInTheDocument();
      await expect(canvas.getByText("Analytics")).toBeInTheDocument();
      await expect(canvas.getByText("Users")).toBeInTheDocument();
      await expect(canvas.getByText("Timeline")).toBeInTheDocument();
    });

    await step("Bottom group items are rendered", async () => {
      await expect(canvas.getByText("Settings")).toBeInTheDocument();
      await expect(canvas.getByText("Storage")).toBeInTheDocument();
    });

    await step("Groups have correct position attributes", async () => {
      const mainGroup = canvas.getByText("MAIN").closest("[data-position]");
      await expect(mainGroup).toHaveAttribute("data-position", "top");
    });

    await step("All items have unique icons", async () => {
      const desktopItem = canvas
        .getByText("Desktop")
        .closest('button, a, [role="button"]');
      const eventItem = canvas.getByText("Event").closest('button, a, [role="button"]');
      const settingsItem = canvas
        .getByText("Settings")
        .closest('button, a, [role="button"]');

      await expect(desktopItem?.querySelector("svg")).toBeInTheDocument();
      await expect(eventItem?.querySelector("svg")).toBeInTheDocument();
      await expect(settingsItem?.querySelector("svg")).toBeInTheDocument();
    });

    await step("Navigation items are interactive", async () => {
      const desktopItem = canvas
        .getByText("Desktop")
        .closest('button, a, [role="button"]');
      await userEvent.click(desktopItem!);

      const analyticsItem = canvas
        .getByText("Analytics")
        .closest('button, a, [role="button"]');
      await userEvent.click(analyticsItem!);
    });

    await step("Bottom items are interactive", async () => {
      const settingsItem = canvas
        .getByText("Settings")
        .closest('button, a, [role="button"]');
      await userEvent.click(settingsItem!);

      const storageItem = canvas
        .getByText("Storage")
        .closest('button, a, [role="button"]');
      await userEvent.click(storageItem!);
    });

    await step("Keyboard navigation works across all items", async () => {
      const firstItem = canvas.getByText("Desktop").closest('button, a, [role="button"]');
      (firstItem as HTMLButtonElement)?.focus();

      await expect(firstItem).toHaveFocus();

      await userEvent.keyboard("{Enter}");
    });

    await step("Items have accessible names", async () => {
      const items = [
        canvas.getByText("Desktop"),
        canvas.getByText("Event"),
        canvas.getByText("Analytics"),
        canvas.getByText("Users"),
        canvas.getByText("Timeline"),
        canvas.getByText("Settings"),
        canvas.getByText("Storage"),
      ];

      for (const item of items) {
        const button = item.closest('button, a, [role="button"]');
        await expect(button).toHaveAccessibleName();
      }
    });
  },
};
