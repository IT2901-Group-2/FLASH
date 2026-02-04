import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const SidebarGroup = ({ title, children }: SidebarGroupProps) => {
  return (
    <div className={styles.sidebarGroup}>
      <span className={styles.title}>{title.toUpperCase()}</span>
      {children}
    </div>
  );
};

export default SidebarGroup;
