import { cloneElement, HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import SidebarTrigger from "./SidebarTrigger";
import { useSidebar } from "./SidebarContext";

export interface SidebarHeaderProps extends HTMLAttributes<HTMLElement> {
  logo?: React.ReactElement<HTMLDivElement>;
}

/**
 * The header component for the sidebar
 */
export const SidebarHeader = ({ logo, children, ...rest }: SidebarHeaderProps) => {
  const { showToggleButton } = useSidebar();

  return (
    <div className={styles.sidebarHeader} {...rest}>
      <span className={styles.headerLogoContainer}>
        <div className={styles.logo}>{logo && cloneElement(logo)}</div>
        <div className={styles.headerText}>{children}</div>
      </span>
      {showToggleButton && <SidebarTrigger />}
    </div>
  );
};
export default SidebarHeader;
