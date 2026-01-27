import React from "react";
import { Loader } from "../Loader";
import styles from "./Input.module.css";
import { cl } from "@/util/className";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
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
   * **Avoid using if possible for accessibility purposes**.
   *
   * Prevent the user from interacting with the input: it cannot be focused or edited.
   */
  disabled?: boolean;
  /**
   * Shows a loader inside the input (useful for search/validation states)
   * @default false
   */
  loading?: boolean;
  /**
   * Input icon (e.g., search icon, user icon)
   */
  icon?: React.ReactNode;
  /**
   * Icon position in input
   * @default "left"
   */
  iconPosition?: "left" | "right";
  /**
   * Error message to display below input
   */
  error?: string;
  /**
   * Helper text to display below input
   */
  helperText?: string;
  /**
   * Overrides inherited color scheme.
   */
  "data-color"?: "accent" | "neutral" | "brand-purple";
  /**
   * Shows success state styling
   * @default false
   */
  success?: boolean;
  /**
   * Ref to the input element
   */
  ref?: React.Ref<HTMLInputElement>;
}
/**
 * An input component
 * @example
 * ```jsx
 * <Input placeholder="Enter your email" />
 * ```
 */

export const Input = ({
  variant = "primary",
  size = "medium",
  disabled,
  loading = false,
  icon,
  iconPosition = "left",
  error,
  helperText,
  success = false,
  "data-color": data = "brand-purple",
  className,
  ref,
  ...props
}: InputProps) => {
  return (
    <div className={cl(styles.inputWrapper, className)}>
      <div
        className={cl(
          styles.inputContainer,
          loading && styles.loading,
          disabled && styles.disabled,
          error && styles.error,
          success && styles.success
        )}
        data-color={data}
        data-variant={variant}
        data-size={size}
      >
        {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>}
        <input
          ref={ref}
          className={styles.input}
          disabled={disabled || loading}
          {...props}
        />
        {loading && (
          <span className={styles.loaderContainer}>
            <Loader size={size} />
          </span>
        )}
        {icon && iconPosition === "right" && !loading && (
          <span className={styles.icon}>{icon}</span>
        )}
      </div>
      {(error || helperText) && (
        <span className={cl(styles.message, error && styles.errorMessage)}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};
export default Input;
