import { HTMLAttributes } from "react";
import styles from "./SidebarFooter.module.css";

/**
 * The footer in the admin sidebar.
 */
export const SidebarFooter = ({ ...rest }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={styles.footer} {...rest}>
      <div className={styles.userIcon}>A</div>
      <div className={styles.userName}>admin</div>
      {/* <ChevronUp/> */}
    </div>
  );
};

export default SidebarFooter;
