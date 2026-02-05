import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The title of the section
   */
  title?: string;
  /**
   * Where in the sidebar this group is positioned
   * @default "top"
   */
  position?: "top" | "bottom" | "center";
}

/**
 * Component to group simelar SidebarItems.
 * @see SidebarItem
 */
export const SidebarGroup = ({
  title,
  position = "top",
  children,
  ...rest
}: SidebarGroupProps) => {
  return (
    <div className={styles.sidebarGroup} data-position={position} {...rest}>
      {title && <span className={styles.title}>{title.toUpperCase()}</span>}
      {children}
    </div>
  );
};

export default SidebarGroup;
