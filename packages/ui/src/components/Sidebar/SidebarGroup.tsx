import { HTMLAttributes } from "react";
import styles from "./Sidebar.module.css";
import { useSidebar } from "./SidebarContext";
import { SidebarItem } from "./Sidebar";

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
  /**
   * If the children of the group should be hidden when the sidebar is closed.
   * @default false
   */
  hideChildrenWhenClosed?: boolean;
  /**
   * An optional icon that is shown if children are hidden when the sidebar is
   * closed. This icon is the only thing shown for the group if the sidebar is
   * in the closed state.
   *
   * When the icon is clicked, the sidebar will open and show the children
   * of the group.
   */
  icon?: React.ReactElement;
  /**
   * If the sidebar should scroll when the content exceeds the height of the
   * screen.
   * @default false
   */
  scroll?: boolean;
}

/**
 * Component to group simelar SidebarItems.
 * @see SidebarItem
 */
export const SidebarGroup = ({
  title,
  position = "top",
  hideChildrenWhenClosed = false,
  scroll = false,
  icon,
  children,
  ...rest
}: SidebarGroupProps) => {
  const { open, setOpen } = useSidebar();

  const showChildren = open || !hideChildrenWhenClosed;

  return (
    <div
      className={styles.sidebarGroup}
      data-position={position}
      data-scroll={scroll}
      {...rest}
    >
      {title && <span className={styles.title}>{title.toUpperCase()}</span>}
      <div className={styles.groupItems}>
        {icon && !showChildren && (
          <SidebarItem icon={icon} onClick={() => setOpen(true)} />
        )}
        {showChildren && children}
      </div>
    </div>
  );
};

export default SidebarGroup;
