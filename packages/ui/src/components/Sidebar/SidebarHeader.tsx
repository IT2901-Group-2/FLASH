import { cloneElement, HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import SidebarTrigger from "./SidebarTrigger";

export interface SidebarHeaderProps extends HTMLAttributes<HTMLElement> {
  logo?: React.ReactElement<HTMLDivElement>;
}

/**
 * The header component for the sidebar
 */
export const SidebarHeader = ({ logo, ...rest }: SidebarHeaderProps) => {
  return (
    <div className={styles.sidebarHeader} {...rest}>
      <div className={styles.logo}>{logo && cloneElement(logo)}</div>
      <SidebarTrigger />
    </div>
  );
};
export default SidebarHeader;
