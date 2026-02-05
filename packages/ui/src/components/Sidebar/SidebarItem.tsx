import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import { useSidebar } from "./SidebarContext";

export interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The icon to the left of the (optional) text for the links to other pages
   * in the sidebar. This icon is the only thing shown for the link to the page
   * if the sidebar is in the closed state.
   */
  icon: React.ReactElement;
}

/**
 * Component representing a clickable link to another page in the sidebar.
 */
export const SidebarItem = ({ children, icon, ...rest }: SidebarItemProps) => {
  const { open } = useSidebar();

  return (
    <button className={styles.sidebarItem}>
      {icon}
      {open && (
        <span className={styles.itemTitle} {...rest}>
          {children}
        </span>
      )}
    </button>
  );
};

export default SidebarItem;
