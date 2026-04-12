import { Meta, StoryObj } from "@storybook/react-vite";
import Sidebar from "./Sidebar";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  House,
  Languages,
  Moon,
  SquareDashed,
} from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

const EXAMPLE_EVENTS = ["Event 1", "Event 2", "Event 3"];

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

export const Default: Story = {
  render: () => (
    <Sidebar.Provider open={false}>
      <Sidebar>
        <Sidebar.Header />
        <Sidebar.Group title="Admin">
          <Sidebar.Item icon={<House />} border>
            Dashboard
          </Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group title="Events" hideChildrenWhenClosed icon={<Calendar />} scroll>
          {EXAMPLE_EVENTS.map((event, key) => (
            <Sidebar.Item key={key} border>
              {event} <ChevronRight />
            </Sidebar.Item>
          ))}
        </Sidebar.Group>
        <Sidebar.Group title="Options" position="bottom">
          <Sidebar.Item icon={<Languages />}>Language </Sidebar.Item>
          <Sidebar.Item icon={<Moon />}>Dark Mode</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.Item icon={<ArrowLeft />} data-color="brand-purple">
            Exit
          </Sidebar.Item>
        </Sidebar.Group>
      </Sidebar>
    </Sidebar.Provider>
  ),
  play: async ({ canvas, step }) => {
    const sidebar = canvas.getByTestId("sidebar");

    await step("Sidebar is rendered", async () => {
      expect(sidebar).toBeInTheDocument();
    });

    await step("Sidebar is closed by default", async () => {
      expect(sidebar).toHaveAttribute("data-open", "false");
    });

    await step("Sidebar opens and closes correctly", async () => {
      const trigger = canvas.getByTestId("sidebar-trigger");

      await userEvent.click(trigger);
      expect(sidebar).toHaveAttribute("data-open", "true");
      await userEvent.click(trigger);
      expect(sidebar).toHaveAttribute("data-open", "false");
    });
  },
};

export const Simple: Story = {
  render: () => (
    <Sidebar.Provider>
      <Sidebar>
        <Sidebar.Header>
          <Sidebar.Trigger />
        </Sidebar.Header>
      </Sidebar>
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
