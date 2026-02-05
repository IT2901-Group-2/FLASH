import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarHeaderProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * The header component for the sidebar
 */
export const SidebarHeader = ({ children, ...rest }: SidebarHeaderProps) => {
  return (
    <div className={styles.sidebarHeader} {...rest}>
      {children}
    </div>
  );
};
export default SidebarHeader;
