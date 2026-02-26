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
export const SidebarHeader = ({ logo, ...rest }: SidebarHeaderProps) => {
  const { showToggleButton } = useSidebar();

  return (
    <div className={styles.sidebarHeader} {...rest}>
      <div className={styles.logo}>{logo && cloneElement(logo)}</div>
      {showToggleButton && <SidebarTrigger />}
    </div>
  );
};
export default SidebarHeader;
