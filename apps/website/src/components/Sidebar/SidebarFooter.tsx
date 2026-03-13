import { HTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import styles from "./SidebarFooter.module.css";

/**
 * The footer in the admin sidebar.
 */
export const SidebarFooter = ({ ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const t = useTranslations("common.roles");
  const adminLabel = t("admin");

  return (
    <div className={styles.footer} {...rest}>
      <div className={styles.userIcon}>{adminLabel.charAt(0)}</div>
      <div className={styles.userName}>{adminLabel}</div>
      {/* <ChevronUp/> */}
    </div>
  );
};

export default SidebarFooter;
