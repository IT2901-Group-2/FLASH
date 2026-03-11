import React, { useEffect, useRef, useState } from "react";
import styles from "./Textarea.module.css";
import formStyles from "../Form.module.css";
import { cl, composeEventHandlers, omit } from "@/util/helpers";
import { FormFieldProps, useFormField } from "../useFormField";
import { useAutoResize } from "@/util/hooks/useAutoResize";
import { useMergeRefs } from "@/util/hooks";

export interface TextareaProps
  extends FormFieldProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Allowed character-count for content
   * This is just a visual indicator and has to be checked manually.
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
   * Maximum number of rows to display.
   */
  maxRows?: number;
  /**
   * Minimum number of rows to display when empty.
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
  /**
   * The refrence to the textarea element
   */
  ref?: React.Ref<HTMLTextAreaElement>;
}
/**
 * An Textarea allows the user to enter and edit text or data in a more than one line.
 *
 * > _Last updated: `2026-03-10`_
 */
export const Textarea = ({
  "data-color": color,
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
  ref,
  ...rest
}: TextareaProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mergedRefs = useMergeRefs(inputRef, ref);
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
      data-color={color}
      className={cl(className, formStyles.field, !!disabled && formStyles.disabled)}
    >
      <label hidden={hideLabel} htmlFor={inputProps.id} className={cl(formStyles.label)}>
        {label}
        {rest.required && <span className={formStyles.requiredStar}>*</span>}
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
        {...omit(rest, ["error", "errorId", "size", "required"])}
        {...inputProps}
        ref={mergedRefs}
        data-scroll={scroll}
        data-resize={resize}
        onChange={composeEventHandlers(
          resizeArea,
          rest.onChange,
          value === undefined ? e => setUncontrolledValue(e.target.value) : undefined
        )}
        rows={rest.minRows || minRows}
        readOnly={readOnly}
        disabled={disabled}
        className={styles.input}
      />
      {hasMaxLength && !readOnly && !inputProps.disabled && (
        <Counter
          currentLength={value?.length ?? uncontrolledValue.length}
          maxLength={maxLength}
        />
      )}
      <div className={formStyles.error} id={errorId}>
        {showErrorMsg && <p>{rest.error}</p>}
      </div>
    </div>
  );
};

interface CounterProps {
  maxLength: number;
  currentLength: number;
}

const Counter = ({ maxLength, currentLength }: CounterProps) => {
  return (
    <span
      className={cl(
        formStyles.description,
        currentLength > maxLength && formStyles.error
      )}
    >
      {currentLength}/{maxLength}
    </span>
  );
};

export default Textarea;
