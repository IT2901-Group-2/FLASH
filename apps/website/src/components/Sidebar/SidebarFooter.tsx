import { ChevronUp } from "lucide-react";
import styles from "./SidebarFooter.module.css";

export const SidebarFooter = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.userIcon}>A</div>
      <div className={styles.userName}>admin</div>
      <ChevronUp />
    </div>
  );
};

export default SidebarFooter;
