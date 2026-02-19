"use client";

import { Calendar, HardDrive, House, Moon, Settings, Sun } from "lucide-react";
import { Sidebar } from "ui";
import SidebarFooter from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";
import { useTranslations } from "next-intl";
import { HTMLAttributes } from "react";
import { useTheme } from "@/hooks/useTheme";
import { capitalize } from "@/utils/string-utils";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useRouter } from "next/navigation";

/**
 * Admin sidebar used in the /admin/dashboard pages
 */
export const AdminSidebar = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const navigation = useRouter();
  const t = useTranslations("admin.dashboard.sidebar");
  const { resolvedTheme, toggleTheme } = useTheme();

  const mounted = useIsMounted();

  return (
    <Sidebar className={className} {...rest}>
      <Sidebar.Trigger style={{ top: "3.5rem" }} />
      {/* Positioning. Didn't think of a better way */}
      <Sidebar.Header>
        <SidebarHeader />
      </Sidebar.Header>
      <Sidebar.Group title="MAIN">
        <Sidebar.Item
          icon={<House />}
          onClick={() => navigation.push("/admin/dashboard")}
        >
          {t("desktop")}
        </Sidebar.Item>
        <Sidebar.Item
          icon={<Calendar />}
          onClick={() => navigation.push("/admin/dashboard/event")}
        >
          {t("event")}
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group title="Config" position="bottom">
        <Sidebar.Item icon={<Settings />}>{t("settings")}</Sidebar.Item>
        <Sidebar.Item icon={<HardDrive />}>{t("storage")}</Sidebar.Item>
        {mounted && (
          <Sidebar.Item
            icon={resolvedTheme === "dark" ? <Sun /> : <Moon />}
            onClick={toggleTheme}
          >
            {capitalize(resolvedTheme)} mode
          </Sidebar.Item>
        )}
      </Sidebar.Group>
      <Sidebar.Footer>
        <SidebarFooter />
      </Sidebar.Footer>
    </Sidebar>
  );
};

export default AdminSidebar;
