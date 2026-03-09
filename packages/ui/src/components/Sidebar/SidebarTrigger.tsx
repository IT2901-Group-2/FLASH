import { Sidebar } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import styles from "./Sidebar.module.css";
import { HTMLAttributes } from "react";
import { cl } from "@/util/helpers";

/**
 * A trigger used for opening/closeing the sidebar
 */
export const SidebarTrigger = ({
  className,
  ...rest
}: HTMLAttributes<HTMLButtonElement>) => {
  const { toggleOpen } = useSidebar();

  return (
    <button
      className={cl(styles.trigger, className)}
      onClick={toggleOpen}
      data-testid="sidebar-trigger"
      {...rest}
    >
      <Sidebar />
    </button>
  );
};
export default SidebarTrigger;
