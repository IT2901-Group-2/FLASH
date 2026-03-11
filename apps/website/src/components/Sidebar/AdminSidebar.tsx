"use client";

import { Calendar, HardDrive, House, Moon, Settings, Sun } from "lucide-react";
import { Sidebar } from "ui";
import SidebarFooter from "./SidebarFooter";
import { useTranslations } from "next-intl";
import { HTMLAttributes } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useRouter } from "next/navigation";
import Logo from "../Logo/Logo";

/**
 * Admin sidebar used in the /admin/dashboard pages
 */
export const AdminSidebar = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const navigation = useRouter();
  const t = useTranslations("common.navigation");
  const { resolvedTheme, toggleTheme } = useTheme();

  const mounted = useIsMounted();

  return (
    <Sidebar className={className} {...rest}>
      <Sidebar.Header logo={<Logo />} />
      <Sidebar.Group title={t("main")}>
        <Sidebar.Item
          icon={<House />}
          onClick={() => navigation.push("/admin/dashboard")}
        >
          {t("desktop")}
        </Sidebar.Item>
        <Sidebar.Item
          icon={<Calendar />}
          onClick={() => navigation.push("/admin/dashboard/events")}
        >
          {t("events")}
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group title={t("config")} position="bottom">
        <Sidebar.Item icon={<Settings />}>{t("settings")}</Sidebar.Item>
        <Sidebar.Item icon={<HardDrive />}>{t("storage")}</Sidebar.Item>
        {mounted && (
          <Sidebar.Item
            icon={resolvedTheme === "dark" ? <Sun /> : <Moon />}
            onClick={toggleTheme}
          >
            {resolvedTheme === "dark" ? t("darkMode") : t("lightMode")}
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


