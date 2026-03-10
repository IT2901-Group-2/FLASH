import React, { useEffect, useRef, useState } from "react";
import styles from "./Textarea.module.css";
import formStyles from "../Form.module.css";
import { cl, composeEventHandlers, omit } from "@/util/helpers";
import { FormFieldProps, useFormField } from "../useFormField";
import { useAutoResize } from "@/util/hooks/useAutoResize";

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
  /**
   * If the textarea should scroll instead of expand when overflowing. Requires
   * parent element to have max-height.
   */
  scroll?: boolean;
}
/**
 * An Textarea allows the user to enter and edit text or data in a more than one line.
 *
 * > _Last updated: `2026-03-10`_
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
  scroll,
  readOnly,
  ...rest
}: TextareaProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { inputProps, errorId, showErrorMsg, size, inputDescriptionId } = useFormField(
    rest,
    "textarea"
  );

  const hasMaxLength = maxLength !== undefined && maxLength > 0;
  const minRows = rest.minRows ?? (size === "small" ? 2 : 3);

  const resizeArea = useAutoResize(inputRef, minRows, rest.maxRows);

  const [uncontrolledValue, setUncontrolledValue] = useState<string>(
    rest.defaultValue ?? ""
  );

  // Resize on mount because it is slightly different than default
  useEffect(resizeArea, []);

  return (
    <div
      data-error={!!rest.error}
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
        ref={inputRef}
        data-scroll={scroll}
        data-resize={resize}
        onChange={() => {
          resizeArea();
          composeEventHandlers(
            rest.onChange,
            value === undefined ? e => setUncontrolledValue(e.target.value) : undefined
          );
        }}
        rows={rest.minRows || minRows}
        readOnly={readOnly}
        disabled={disabled}
        className={styles.input}
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
