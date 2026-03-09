import React, { useContext, useId } from "react";
import { cl } from "@/util/helpers";
import { FieldsetContext } from "./Fieldset/Fieldset.context";

export interface FormFieldProps {
  /**
   * Error message.
   */
  error?: React.ReactNode;
  /**
   * Override internal errorId.
   */
  errorId?: string;
  /**
   * Changes font-size, padding and gaps.
   */
  size?: "medium" | "small";
  /**
   * **Avoid using if possible for accessibility purposes**.
   *
   * Disables element.
   */
  disabled?: boolean;
  /**
   * Adds a description to extend the labeling.
   */
  description?: React.ReactNode;
  /**
   * Override internal id.
   */
  id?: string;
  /**
   * Read-only state.
   */
  readOnly?: boolean;
}

export interface FormFieldType {
  showErrorMsg: boolean;
  hasError: boolean;
  errorId: string;
  inputDescriptionId: string;
  size: "small" | "medium";
  inputProps: {
    id: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    disabled?: boolean;
  };
  readOnly?: boolean;
}

/**
 * Handles props and their state for various form-fields in context with Fieldset
 */
export const useFormField = (
  {
    readOnly: _readOnly,
    id: _id,
    error,
    size,
    description,
    disabled: _disabled,
    errorId: _errorId,
  }: FormFieldProps,
  prefix: string
): FormFieldType => {
  const fieldset = useContext(FieldsetContext);

  const genId = useId();

  const id = _id ?? `${prefix}-${genId}`;
  const errorId = _errorId ?? `${prefix}-error-${genId}`;
  const inputDescriptionId = `${prefix}-description-${genId}`;

  const disabled = fieldset?.disabled || _disabled;
  const readOnly = ((fieldset?.readOnly || _readOnly) && !disabled) || undefined;

  const hasError: boolean = !disabled && !readOnly && !!(error || fieldset?.error);
  const showErrorMsg = !disabled && !readOnly && !!error && typeof error !== "boolean";

  const ariaInvalid = { ...(hasError ? { "aria-invalid": true } : {}) };

  return {
    showErrorMsg,
    hasError,
    errorId,
    inputDescriptionId,
    size: size ?? fieldset?.size ?? "medium",
    readOnly,
    inputProps: {
      id,
      ...ariaInvalid,
      "aria-describedby":
        cl(
          //props["aria-describedby"],
          {
            [inputDescriptionId]: description,
            [errorId]: showErrorMsg,
            [fieldset?.errorId ?? ""]: hasError && fieldset?.error,
          }
        ) || undefined,

      disabled,
    },
  };
};
