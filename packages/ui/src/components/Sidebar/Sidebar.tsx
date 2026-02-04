import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import SidebarGroup, { SidebarGroupProps } from "./SidebarGroup";
import SidebarHeader, { SidebarHeaderProps } from "./SidebarHeader";
import SidebarFooter, { SidebarFooterProps } from "./SidebarFooter";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

export const Sidebar = ({ open = true, children, ...rest }: SidebarProps) => {
  return (
    <div data-color={"foreground"} data-open={open} className={styles.sidebar} {...rest}>
      {children}
    </div>
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
