import React, { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import SidebarGroup, { SidebarGroupProps } from "./SidebarGroup";
import SidebarHeader, { SidebarHeaderProps } from "./SidebarHeader";
import SidebarFooter, { SidebarFooterProps } from "./SidebarFooter";
import SidebarProvider, { useSidebar } from "./SidebarContext";
import SidebarTrigger from "./SidebarTrigger";
import { cl } from "@/util/className";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * If the sidebar starts open or not
   * @default true
   */
  defaultOpen?: boolean;
  /**
   * Callback function that is called every time the sidebar opens/closes
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * The main container for the sidebar
 */
const SidebarMain = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar();

  return (
    <div
      data-color={"foreground"}
      data-open={open}
      className={cl(className, styles.sidebar)}
      {...rest}
      role="sidebar"
    >
      {children}
    </div>
  );
};

/**
 * The sidebar is used in on every admin page.
 *
 * > _Last updated: `2026-02-05`_
 */
export const Sidebar = ({
  defaultOpen = true,
  onOpenChange,
  children,
  className,
  ...rest
}: SidebarProps) => {
  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <SidebarMain className={className} {...rest}>
        {children}
      </SidebarMain>
    </SidebarProvider>
  );
};

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
