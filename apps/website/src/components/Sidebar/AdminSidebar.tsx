import { Calendar, HardDrive, House, Settings } from "lucide-react";
import { Sidebar } from "ui";
import SidebarFooter from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";
import { useTranslations } from "next-intl";
import { HTMLAttributes } from "react";

/**
 * Admin sidebar used in the /admin/dashboard pages
 */
export const AdminSidebar = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const t = useTranslations("admin.dashboard.sidebar");
  return (
    <Sidebar className={className} {...rest}>
      <Sidebar.Trigger style={{ top: "3.5rem" }} />{" "}
      {/* Positioning. Didn't think of a better way */}
      <Sidebar.Header>
        <SidebarHeader />
      </Sidebar.Header>
      <Sidebar.Group title="MAIN">
        <Sidebar.Item icon={<House />}>{t("desktop")}</Sidebar.Item>
        <Sidebar.Item icon={<Calendar />}>{t("event")}</Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group title="Config" position="bottom">
        <Sidebar.Item icon={<Settings />}>{t("settings")}</Sidebar.Item>
        <Sidebar.Item icon={<HardDrive />}>{t("storage")}</Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Footer>
        <SidebarFooter />
      </Sidebar.Footer>
    </Sidebar>
  );
};

export default AdminSidebar;
