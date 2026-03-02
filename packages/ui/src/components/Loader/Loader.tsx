import { SVGProps } from "react";
import styles from "./Loader.module.css";
import { cl } from "@/util/helpers";

export interface LoaderProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  /**
   * Changes loader width/height.
   * 88px | 64px | 40px | 32px | 24px | 20px | 16px
   * @default "medium"
   */
  size?: "3xlarge" | "2xlarge" | "xlarge" | "large" | "medium" | "small" | "xsmall";
  /**
   * Title prop on svg
   * @default "Waiting..."
   */
  title?: React.ReactNode;
  /**
   * Sets svg-background to transparent
   * @default false
   */
  transparent?: boolean;
  /**
   * Colored variants for Loader
   * @default "neutral"
   */
  variant?: "neutral" | "interaction"; //"inverted"
}

/**
 * Loader is a visual indication that something is loading or taking time. Even though
 * users get little information about what is happening, they get an * * assurance that
 * something is happening.
 *
 * > _Last updated: `2026-02-02`_
 *
 * ### Suitable for:
 * - Loading content on the page.
 * - Indicating when an action has temporarily stopped the application.
 * - Indicating loading that takes more than 1 second.
 * - Indicating that data is being saved when the user clicks "save".
 *
 * ### Unsuitable for:
 * - When loading takes less than 1 second.
 * - Showing that individual elements on the page are being loaded (consider Skeleton).
 * - Longer processes where duration or progress is known (see ProgressBar).
 */
export const Loader = ({
  className,
  size = "medium",
  title = "Waiting...",
  transparent = false,
  variant = "neutral",
  id,
  ...rest
}: LoaderProps) => {
  return (
    <svg
      focusable="false"
      viewBox="0 0 50 50"
      preserveAspectRatio="xMidYMid"
      data-variant={variant}
      className={`${cl(
        styles.loader,
        className,
        styles[`loader--${size}`],
        styles[`loader--${variant}`],
        transparent && [styles["loader--transparent"]]
      )}`}
      id={id}
      {...rest}
    >
      <title>{title}</title>
      <circle
        xmlns="http://www.w3.org/2000/svg"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        className={styles.loader__background}
      />
      <circle
        xmlns="http://www.w3.org/2000/svg"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeDasharray="50 155"
        className={styles.loader__foreground}
      />
    </svg>
  );
};
export default Loader;
