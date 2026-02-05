import { HTMLAttributes, useState } from "react";
import styles from "./Sidebar.module.css";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import SidebarGroup, { SidebarGroupProps } from "./SidebarGroup";
import SidebarHeader, { SidebarHeaderProps } from "./SidebarHeader";
import SidebarFooter, { SidebarFooterProps } from "./SidebarFooter";
import { ChevronLeft } from "lucide-react";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

export const Sidebar = ({ open = true, children, ...rest }: SidebarProps) => {
  const [_open, setOpen] = useState<boolean>(open);

  return (
    <div data-color={"foreground"} data-open={_open} className={styles.sidebar} {...rest}>
      <div className={styles.stateButton} onClick={() => setOpen(o => !o)}>
        <ChevronLeft />
      </div>
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
