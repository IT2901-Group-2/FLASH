import React from "react";
import { Loader } from "../Loader";
import styles from "./Input.module.css";
import { cl } from "@/util/className";
import { ColorName } from "@/styles/colorType";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Changes design and interaction-visuals.
   * As of now their only exists styling for the primary variant
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "tertiary";
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
  "data-color"?: ColorName;
  /**
   * Shows success state styling
   * @default false
   */
  success?: boolean;
  /**
   * Ref to the input element
   */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Label text for the input
   */
  label?: string;
  /**
   * Accessible label for screen readers (REQUIRED for accessibility)
   * This will be used even if a visible label is provided
   */
  "aria-label": string;
  /**
   * Whether the input is required (adds asterisk to label)
   * @default false
   */
  required?: boolean;
}
/**
 * An input component
 * @example
 * ```jsx
 * <Input label="Email" placeholder="Enter your email" />
 * ```
 */

export const Input = ({
  variant = "primary",
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
  label,
  required = false,
  "aria-label": ariaLabel,
  id,
  ...props
}: InputProps) => {
  // Generate a unique ID if not provided (needed for label association)
  const inputId = id || `input-${React.useId()}`;
  return (
    <div
      className={cl(styles.inputWrapper, className)}
      data-color={data}
      data-variant={variant}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
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
      >
        {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          disabled={disabled || loading}
          required={required}
          aria-label={ariaLabel}
          {...props}
        />
        {loading && (
          <span className={styles.loaderContainer}>
            <Loader />
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
