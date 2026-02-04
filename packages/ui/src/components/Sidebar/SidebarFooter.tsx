import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarFooterProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const SidebarFooter = ({ children }: SidebarFooterProps) => {
  return <div className={styles.sidebarFooter}>{children}</div>;
};
export default SidebarFooter;
