import React, { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import SidebarGroup, { SidebarGroupProps } from "./SidebarGroup";
import SidebarHeader, { SidebarHeaderProps } from "./SidebarHeader";
import SidebarFooter, { SidebarFooterProps } from "./SidebarFooter";
import { ChevronLeft } from "lucide-react";
import SidebarProvider, { useSidebar } from "./SidebarContext";

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
const SidebarMain = ({ children, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const { open, toggleOpen } = useSidebar();

  return (
    <div data-color={"foreground"} data-open={open} className={styles.sidebar} {...rest}>
      <div className={styles.stateButton} onClick={toggleOpen}>
        <ChevronLeft />
      </div>
      {children}
    </div>
  );
};

/**
 * The outer most compoent used in the sidebar
 */
export const Sidebar = ({
  defaultOpen = true,
  onOpenChange,
  children,
  ...rest
}: SidebarProps) => {
  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <SidebarMain {...rest}>{children}</SidebarMain>
    </SidebarProvider>
  );
};

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
