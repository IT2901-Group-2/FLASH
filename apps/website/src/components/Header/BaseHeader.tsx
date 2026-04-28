import { Sidebar } from "@flash/ui";
import { HTMLAttributes } from "react";
import styles from "./BaseHeader.module.css";

const BaseHeader = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <header className={styles.header}>
      <Sidebar.Trigger />
      <div {...props}>{children}</div>
    </header>
  );
};

export default BaseHeader;
