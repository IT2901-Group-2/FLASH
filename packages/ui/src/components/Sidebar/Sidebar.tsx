import React, { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import SidebarGroup, { SidebarGroupProps } from "./SidebarGroup";
import SidebarHeader, { SidebarHeaderProps } from "./SidebarHeader";
import SidebarFooter, { SidebarFooterProps } from "./SidebarFooter";
import SidebarProvider, { useSidebar } from "./SidebarContext";
import { cl } from "@/util/helpers";
import SidebarTrigger from "./SidebarTrigger";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * If the sidebar is open or not
   * @default true
   */
  open?: boolean;
  /**
   * If the button to toggle the state is visible.
   */
  showToggleButton?: boolean;
  /**
   * Callback function that is called every time the sidebar opens/closes
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * The sidebar is used in on every admin page.
 *
 * > _Last updated: `2026-02-05`_
 */
const Sidebar = ({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar();

  return (
    <aside
      data-open={open}
      className={cl(className, styles.sidebar)}
      {...rest}
      data-testid="sidebar"
    >
      {children}
    </aside>
  );
};

Sidebar.Provider = SidebarProvider;
Sidebar.Header = SidebarHeader;
Sidebar.Group = SidebarGroup;
Sidebar.Item = SidebarItem;
Sidebar.Footer = SidebarFooter;
Sidebar.Trigger = SidebarTrigger;

export default Sidebar;
export { SidebarHeader, SidebarGroup, SidebarItem, SidebarFooter };
export type {
  SidebarHeaderProps,
  SidebarGroupProps,
  SidebarItemProps,
  SidebarFooterProps,
};
