import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarFooterProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * The footer component for the sidebar
 */
export const SidebarFooter = ({ children, ...rest }: SidebarFooterProps) => {
  return (
    <div className={styles.sidebarFooter} {...rest}>
      {children}
    </div>
  );
};
export default SidebarFooter;
