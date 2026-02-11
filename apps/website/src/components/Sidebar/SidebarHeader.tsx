import Logo from "../Logo/Logo";
import styles from "./SidebarHeader.module.css";

export const SidebarHeader = () => {
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} />
      <div className={styles.headerText}>
        <h3 className={styles.title}>PhotoEvent</h3>
        <span>Admin Panel</span>
      </div>
    </div>
  );
};
