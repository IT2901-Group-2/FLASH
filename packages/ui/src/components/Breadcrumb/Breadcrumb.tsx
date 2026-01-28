import { Home, ChevronRight } from "lucide-react";
import styles from "./Breadcrumb.module.css";
import { cl } from "../../util/className";
import { ColorName } from "@/styles/colorType";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  "data-color"?: ColorName;
}

export const Breadcrumb = ({
  items,
  className,
  "data-color": data = "brand-purple",
}: BreadcrumbProps) => {
  return (
    <nav
      className={cl(styles.breadcrumb, className)}
      data-color={data}
      aria-label="Breadcrumb"
    >
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {index === 0 && (
              <>
                {item.href ? (
                  <a href={item.href} className={styles.homeLink}>
                    <Home className={styles.homeIcon} aria-hidden="true" />
                  </a>
                ) : (
                  <Home className={styles.homeIcon} aria-hidden="true" />
                )}
              </>
            )}
            {item.label &&
              (item.href ? (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ) : (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ))}
            {index < items.length - 1 && (
              <ChevronRight className={styles.separator} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
