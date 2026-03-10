import React, { InputHTMLAttributes, useEffect, useId, useState } from "react";
import styles from "./Textarea.module.css";
import formStyles from "../Form.module.css";
import { cl, composeEventHandlers, omit } from "@/util/helpers";
import { FormFieldProps, useFormField } from "../useFormField";
import { debounce } from "@/util/helpers/debounce";

export interface TextareaProps
  extends FormFieldProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Allowed character-count for content
   *
   * This is just a visual indicator! You will still need to handle actual character-limits/validation if needed.
   */
  maxLength?: number;
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Defaults input-value without needing controlled-state
   */
  defaultValue?: string;
  /**
   * Maximum number of character rows to display.
   */
  maxRows?: number;
  /**
   * Minimum number of character-rows to display when empty.
   */
  minRows?: number;
  /**
   * Textarea label.
   */
  label: React.ReactNode;
  /**
   * If enabled shows the label and description for screenreaders only.
   */
  hideLabel?: boolean;
  /**
   * Enables resizing of field.
   */
  resize?: boolean | "vertical" | "horizontal";
}
/**
 * An Textarea allows the user to enter and edit text or data in a more than one line.
 *
 * > _Last updated: `2026-01-29`_
 */
export const Textarea = ({
  label,
  className,
  description,
  maxLength,
  hideLabel = false,
  resize,
  value,
  disabled,
  readOnly,
  ...rest
}: TextareaProps) => {
  const { inputProps, errorId, showErrorMsg, size, inputDescriptionId } = useFormField(
    rest,
    "textarea"
  );

  const hasMaxLength = maxLength !== undefined && maxLength > 0;

  const [uncontrolledValue, setUncontrolledValue] = useState<string>(
    rest.defaultValue ?? ""
  );

  return (
    <div
      data-size={size}
      className={cl(className, formStyles.field, !!disabled && formStyles.disabled)}
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
      <textarea
        {...omit(rest, ["error", "errorId", "size"])}
        {...inputProps}
        onChange={composeEventHandlers(
          rest.onChange,
          value === undefined ? e => setUncontrolledValue(e.target.value) : undefined
        )}
        rows={rest.minRows || (size === "small" ? 2 : 3)}
        readOnly={readOnly}
        disabled={disabled}
        className={cl(
          "aksel-textarea__input",
          "aksel-body-short",
          `aksel-body-short--${size ?? "medium"}`
        )}
      />
      {hasMaxLength && !readOnly && !inputProps.disabled && (
        <span>
          {value?.length ?? uncontrolledValue.length}/{maxLength}
        </span>
      )}
      <div className={formStyles.error} id={errorId}>
        {showErrorMsg && <p>{rest.error}</p>}
      </div>
    </div>
  );
};

export default Textarea;
