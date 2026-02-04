import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarHeaderProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const SidebarHeader = ({ children }: SidebarHeaderProps) => {
  return <div className={styles.sidebarHeader}>{children}</div>;
};
export default SidebarHeader;
