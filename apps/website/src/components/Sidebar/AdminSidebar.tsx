import { Calendar, HardDrive, House, Settings } from "lucide-react";
import { Sidebar } from "ui";
import SidebarFooter from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

/**
 * Admin sidebar used in the /admin/dashboard pages
 */
export const AdminSidebar = () => {
  return (
    <Sidebar>
      <Sidebar.Trigger style={{ top: "3.5rem" }} />{" "}
      {/* Positioning. Didn't think of a better way */}
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
