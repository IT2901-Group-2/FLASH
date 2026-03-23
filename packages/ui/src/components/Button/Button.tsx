import React from "react";
import { Loader } from "../Loader/Loader";
import styles from "./Button.module.css";
import { cl, omit } from "@/util/helpers";
import { ColorName } from "../types";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button Content. */
  children?: React.ReactNode;
  /**
   * Changes design and interaction-visuals.
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "tertiary";
  /**
   * Changes padding, height and font-size
   * @default "medium"
   */
  size?: "medium" | "small" | "xsmall";
  /**
   *  **Avoid using if possible for accessibility purposes**.
   *
   * Prevent the user from interacting with the button: it cannot me pressed or focused.
   */
  disabled?: boolean;
  /**
   * Replaces button component with a Loader component, keeps width.
   * @default false
   */
  loading?: boolean;
  /**
   * Button icon.
   * @default "left"
   */
  icon?: React.ReactNode;
  /**
   * Icon position in button
   */
  iconPosition?: "left" | "right";
  /**
   * Overrides inherited color.
   */
  "data-color"?: ColorName;
  /**
   * Stretch the button to fill avaliable space in the container.
   * @default false
   */
  fill?: boolean;
}

/**
 * A Button allows the user to perform an action.
 *
 * > _Last updated: `2026-02-01`_
 *
 * ### Suitable for:
 * - Form Submission
 * - Calculation of Results
 * - Actions
 */
export const Button = ({
  variant = "primary",
  children,
  size = "medium",
  loading = false,
  disabled,
  "data-color": color = "brand-purple",
  icon,
  iconPosition = "left",
  className,
  type = "button",
  fill = false,
  ...rest
}: ButtonProps) => {
  const filterProps: React.ButtonHTMLAttributes<HTMLButtonElement> =
    disabled || loading ? omit(rest, []) : rest;

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " && !disabled && !loading) e.currentTarget.click();
  };

  const iconNode = icon ? (
    <span
      aria-hidden={loading ? true : undefined}
      className={cl(styles.icon, loading && styles.hidden)}
    >
      {icon}
    </span>
  ) : null;

  return (
    <button
      data-color={color}
      data-variant={variant}
      data-size={size}
      data-fill={fill}
      onKeyUp={handleKeyUp}
      {...filterProps}
      aria-busy={loading || undefined}
      className={cl(
        styles.button,
        loading && styles.loading,
        disabled && styles.disabled,
        className
      )}
      disabled={disabled || loading}
      type={type}
    >
      {icon && iconPosition === "left" && iconNode}
      {loading && (
        <span className={styles.loaderOverlay}>
          <Loader size={size} variant="inverted" />
        </span>
      )}
      {children && (
        <span className={loading ? styles.hidden : undefined}>{children}</span>
      )}
      {icon && iconPosition === "right" && iconNode}
    </button>
  );
};
export default Button;
