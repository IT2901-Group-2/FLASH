import { HTMLAttributes } from "react";
import Logo from "../Logo/Logo";
import styles from "./SidebarHeader.module.css";

export const SidebarHeader = ({ ...rest }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={styles.header} {...rest}>
      <Logo />
      <div className={styles.headerText}>
        <h3 className={styles.title}>PhotoEvent</h3>
        <span>Admin Panel</span>
      </div>
    </div>
  );
};
