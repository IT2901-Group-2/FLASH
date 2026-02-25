import React, { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import SidebarGroup, { SidebarGroupProps } from "./SidebarGroup";
import SidebarHeader, { SidebarHeaderProps } from "./SidebarHeader";
import SidebarFooter, { SidebarFooterProps } from "./SidebarFooter";
import SidebarProvider from "./SidebarContext";
import { cl } from "@/util/helpers/";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * If the sidebar is open or not
   * @default true
   */
  open?: boolean;
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
export const Sidebar = ({
  onOpenChange,
  open,
  className,
  children,
  ...rest
}: SidebarProps) => {
  return (
    <SidebarProvider onOpenChange={onOpenChange} open={open}>
      <div
        data-color={"foreground"}
        data-open={open}
        className={cl(className, styles.sidebar)}
        {...rest}
        role="sidebar"
      >
        {children}
      </div>
    </SidebarProvider>
  );
};

Sidebar.Provider = SidebarProvider;
Sidebar.Header = SidebarHeader;
Sidebar.Group = SidebarGroup;
Sidebar.Item = SidebarItem;
Sidebar.Footer = SidebarFooter;

export default Sidebar;
export { SidebarHeader, SidebarGroup, SidebarItem, SidebarFooter };
export type {
  SidebarHeaderProps,
  SidebarGroupProps,
  SidebarItemProps,
  SidebarFooterProps,
};
