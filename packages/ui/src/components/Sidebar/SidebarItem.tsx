import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
  icon: React.ReactElement;
}

export const SidebarItem = ({ children, icon }: SidebarItemProps) => {
  return (
    <div className={styles.sidebarItem}>
      {icon}
      <span className={styles.itemTitle}>{children}</span>
    </div>
  );
};

export default SidebarItem;
