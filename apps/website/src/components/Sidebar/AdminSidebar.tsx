import { Calendar, HardDrive, House, Settings } from "lucide-react";
import { Sidebar } from "ui";
import SidebarFooter from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

export const AdminSidebar = () => {
  return (
    <Sidebar>
      <Sidebar.Header>
        <SidebarHeader />
      </Sidebar.Header>
      <Sidebar.Group title="MAIN">
        <Sidebar.Item icon={<House />}>Desktop</Sidebar.Item>
        <Sidebar.Item icon={<Calendar />}>Event</Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group title="Config" position="bottom">
        <Sidebar.Item icon={<Settings />}>Settings</Sidebar.Item>
        <Sidebar.Item icon={<HardDrive />}>Storage</Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Footer>
        <SidebarFooter />
      </Sidebar.Footer>
    </Sidebar>
  );
};

export default AdminSidebar;
