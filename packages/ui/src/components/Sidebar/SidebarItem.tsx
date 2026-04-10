import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarItemProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * The icon to the left of the (optional) text for the links to other pages
   * in the sidebar. This icon is the only thing shown for the link to the page
   * if the sidebar is in the closed state.
   */
  icon?: React.ReactElement;
  /**
   * If the item should have a border at the bottom. This is used to separate
   * items in the sidebar.
   * @default false
   */
  border?: boolean;
}

/**
 * Component representing a clickable link to another page in the sidebar.
 */
export const SidebarItem = ({
  "data-color": color,
  border = true,
  icon,
  children,
  ...rest
}: SidebarItemProps) => {
  return (
    <button
      data-color={color}
      data-border={border}
      className={styles.sidebarItem}
      {...rest}
    >
      {icon}
      {<span className={styles.itemTitle}>{children}</span>}
    </button>
  );
};

export default SidebarItem;
