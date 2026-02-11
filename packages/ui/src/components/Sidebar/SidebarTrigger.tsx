import { ChevronLeft } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import styles from "./Sidebar.module.css";
import { HTMLAttributes } from "react";
import { cl } from "@/util/className";

export const SidebarTrigger = ({
  className,
  ...rest
}: HTMLAttributes<HTMLButtonElement>) => {
  const { toggleOpen } = useSidebar();

  return (
    <button
      className={cl(styles.trigger, className)}
      onClick={toggleOpen}
      role="sidebar-trigger"
      {...rest}
    >
      <ChevronLeft />
    </button>
  );
};
export default SidebarTrigger;
