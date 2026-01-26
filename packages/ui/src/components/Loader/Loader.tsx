import { SVGProps } from "react";
import styles from "./Loader.module.css";
import { cl } from "@/util/className";

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
  /**
   * Ref to the button element
   */
  ref?: React.Ref<HTMLButtonElement>;
}

export const Loader = ({
  className,
  size = "medium",
  title = "Waiting...",
  transparent = false,
  variant = "neutral",
  id,
  // ref,
  // ...rest
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
