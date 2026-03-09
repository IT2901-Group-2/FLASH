import React, { InputHTMLAttributes } from "react";
import { Loader } from "../../Loader";
import styles from "./Input.module.css";
import { cl } from "@/util/helpers";
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
}
/**
 * An input allows the user to enter and edit text or data.
 *
 * > _Last updated: `2026-01-29`_
 */
export const TextField = ({
  disabled,
  "data-color": color = "brand-purple",
  className,
  label,
  required = false,
  "aria-label": ariaLabel,
  id,
  description,
  htmlSize,
  hideLabel = false,
  type = "text",
  readOnly,
  ...props
}: TextFieldProps) => {
  const { inputProps, errorId, showErrorMsg, hasError, size, inputDescriptionId } =
    useFormField(props, "textField");

  return <div className={cl(styles.inputWrapper, className)} data-color={color}></div>;
};
export default TextField;
