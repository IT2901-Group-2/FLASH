import React, { InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";
import formStyles from "../Form.module.css";
import { cl, omit } from "@/util/helpers";
import { FormFieldProps, useFormField } from "../useFormField";

export interface TextFieldProps
  extends FormFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Controlled value
   */
  value?: string | number;
  /**
   * Defaults input-value without needing controlled-state
   */
  defaultValue?: string | number;
  /**
   * Exposes the HTML size attribute
   */
  htmlSize?: number;
  /**
   * If enabled shows the label and description for screenreaders only
   */
  hideLabel?: boolean;
  /**
   * TextField label
   */
  label: React.ReactNode;
  /**
   * Type of form control. Picking the correct type helps user fill inn their required information
   * @default "text"
   */
  type?: "email" | "number" | "password" | "tel" | "text" | "url" | "time";
  /**
   * The icon shown in the text field
   */
  icon?: React.ReactNode;
  /**
   * The position of the icon in realtion to the inputed text.
   */
  iconPosition?: "left" | "right";
}
/**
 * An TextField allows the user to enter and edit text or data.
 *
 * > _Last updated: `2026-01-29`_
 */
export const TextField = ({
  "data-color": color,
  className,
  label,
  description,
  disabled,
  htmlSize,
  hideLabel = false,
  type = "text",
  readOnly,
  icon,
  iconPosition = "left",
  ...rest
}: TextFieldProps) => {
  const { inputProps, errorId, showErrorMsg, size, inputDescriptionId } = useFormField(
    rest,
    "textField"
  );

  return (
    <div
      data-size={size}
      className={cl(formStyles.field, disabled && formStyles.disabled, className)}
      data-color={color}
      data-testid="textfield"
    >
      <label hidden={hideLabel} htmlFor={inputProps.id} className={cl(formStyles.label)}>
        {label}
      </label>
      {!!description && (
        <div
          hidden={hideLabel}
          className={formStyles.description}
          id={inputDescriptionId}
        >
          {description}
        </div>
      )}
      <div className={styles.inputContainer}>
        {iconPosition === "left" && icon}
        <input
          {...omit(rest, ["error", "errorId", "size"])}
          {...inputProps}
          type={type}
          readOnly={readOnly}
          className={styles.input}
          size={htmlSize}
          disabled={disabled}
        />
        {iconPosition === "right" && icon}
      </div>
      <div className={formStyles.error} id={errorId}>
        {showErrorMsg && <p>{rest.error}</p>}
      </div>
    </div>
  );
};
export default TextField;
