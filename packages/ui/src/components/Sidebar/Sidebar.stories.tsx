import { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "./Sidebar";
import {
  Calendar,
  ChartColumn,
  Clock4,
  HardDrive,
  House,
  Settings,
  Users,
} from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "Byggeklosser/Komponenter/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    chromatic: { disable: true },
  },
} satisfies Meta<typeof Sidebar>;
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Medium: Story = {
  render: () => {
    return (
      <Sidebar>
        <Sidebar.Header>HEADER</Sidebar.Header>
        <Sidebar.Group title="main">
          <Sidebar.Item icon={<House />}>Desktop</Sidebar.Item>
          <Sidebar.Item icon={<Calendar />}>Event</Sidebar.Item>
          <Sidebar.Item icon={<ChartColumn />}>Analytics</Sidebar.Item>
          <Sidebar.Item icon={<Users />}>Users</Sidebar.Item>
          <Sidebar.Item icon={<Clock4 />}>Timeline</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group title="Config">
          <Sidebar.Item icon={<Settings />}>Settings</Sidebar.Item>
          <Sidebar.Item icon={<HardDrive />}>Timeline</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Footer>FOOTER</Sidebar.Footer>
      </Sidebar>
    );
  },
};
