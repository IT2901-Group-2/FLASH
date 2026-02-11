import { ChevronLeft } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import styles from "./Sidebar.module.css";
import { HTMLAttributes } from "react";

export const SidebarTrigger = ({ ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const { toggleOpen } = useSidebar();

  return (
    <div className={styles.trigger} onClick={toggleOpen} role="sidebar-trigger" {...rest}>
      <ChevronLeft />
    </div>
  );
};
export default SidebarTrigger;
