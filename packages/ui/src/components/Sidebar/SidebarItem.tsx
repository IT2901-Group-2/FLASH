import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import { useSidebar } from "./SidebarContext";

export interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
  icon: React.ReactElement;
}

export const SidebarItem = ({ children, icon, ...rest }: SidebarItemProps) => {
  const { open } = useSidebar();

  return (
    <div className={styles.sidebarItem}>
      {icon}
      {open && (
        <span className={styles.itemTitle} {...rest}>
          {children}
        </span>
      )}
    </div>
  );
};

export default SidebarItem;
