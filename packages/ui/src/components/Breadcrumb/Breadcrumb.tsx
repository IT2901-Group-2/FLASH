import { Home, ChevronRight } from "lucide-react";
import styles from "./Breadcrumb.module.css";
import { cl } from "@/util/helpers";
import { ColorName } from "../types";

export interface BreadcrumbItem {
  /** The text label for the breadcrumb item. */
  label: string;
  /** Optional URL for the breadcrumb link. */
  href?: string;
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items to display. */
  items: BreadcrumbItem[];
  /** Optional CSS class name for custom styling. */
  className?: string;
  /**
   * Overrides inherited color.
   */
  "data-color"?: ColorName;
}

/**
 * A breadcrumb navigation component for displaying the user's location in a
 * hierarchical structure.
 *
 * The first item displays a home icon, middle items are clickable links, and
 * the last item represents the current page.
 *
 * > _Last updated: `2026-02-07`_
 *
 */
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
                  <a
                    href={item.href}
                    className={styles.homeLink}
                    aria-label={item.label || "Home"}
                  >
                    <Home className={styles.homeIcon} aria-hidden="true" />
                  </a>
                ) : (
                  <Home className={styles.homeIcon} aria-hidden="true" />
                )}
              </>
            )}
            {item.label &&
              (item.href ? (
                <a
                  href={item.href}
                  className={styles.link}
                  aria-label={`Go to ${item.label}`}
                >
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
