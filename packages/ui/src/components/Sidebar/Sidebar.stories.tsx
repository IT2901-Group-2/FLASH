import { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "./Sidebar";
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

const meta: Meta<typeof Sidebar> = {
  title: "Byggeklosser/Komponenter/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "left",
    chromatic: { disable: true },
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
  render: () => <Sidebar />,
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Sidebar>
      <Sidebar.Header />
      <Sidebar.Footer />
    </Sidebar>
  ),
  play: async ({ canvasElement, args, step }) => {
    await step("Sidebar opens and closes correctly", async () => {});
  },
};

export const WithGroupAndItems: Story = {
  render: () => (
    <Sidebar>
      <Sidebar.Header />
      <Sidebar.Group title="Test Title">
        <Sidebar.Item icon={<SquareDashed />}>Test 1</Sidebar.Item>
        <Sidebar.Item icon={<SquareDashed />}>Test 2</Sidebar.Item>
        <Sidebar.Item icon={<SquareDashed />}>Test 3</Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Footer />
    </Sidebar>
  ),
};

export const GroupPosition: Story = {
  render: () => (
    <Sidebar>
      <Sidebar.Header />
      <Sidebar.Group title="Test Title" position="center">
        <Sidebar.Item icon={<SquareDashed />}>Test 1</Sidebar.Item>
        <Sidebar.Item icon={<SquareDashed />}>Test 2</Sidebar.Item>
        <Sidebar.Item icon={<SquareDashed />}>Test 3</Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Footer />
    </Sidebar>
  ),
};

export const FullExample: Story = {
  render: () => (
    <Sidebar>
      <Sidebar.Header />
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
      <Sidebar.Footer />
    </Sidebar>
  ),
};
