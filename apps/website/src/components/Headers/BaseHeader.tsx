import { Sidebar } from "@flash/ui";
import { HTMLAttributes } from "react";
import styles from "./BaseHeader.module.css";
import useIsMobile from "@/hooks/useIsMobile";

export interface BaseHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * If the header is hidden on big screens
   * @default false
   */
  hideOnDesktop?: boolean;
}

const BaseHeader = ({ hideOnDesktop = false, children, ...props }: BaseHeaderProps) => {
  const isMobile = useIsMobile();

  if (hideOnDesktop && !isMobile) return;

  return (
    <header className={styles.header}>
      {isMobile && <Sidebar.Trigger />}
      <div {...props} className={styles.headerContent}>
        {children}
      </div>
    </header>
  );
};

export default BaseHeader;
