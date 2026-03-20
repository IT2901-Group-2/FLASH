import { SelectHTMLAttributes } from "react";
import { FormFieldProps, useFormField } from "../useFormField";
import { cl, omit } from "@/util/helpers";
import formStyles from "../Form.module.css";
import styles from "./Select.module.css";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends
    FormFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "onChange"> {
  /**
   * Collection of <option />-elements.
   */
  children: React.ReactNode;
  /**
   * Sets inline-style on select wrapper.
   */
  style?: React.CSSProperties;
  /**
   * Label for select.
   */
  label: React.ReactNode;
  /**
   * Shows label and description for screenreaders only.
   */
  hideLabel?: boolean;
}

const Select = ({
  "data-color": color,
  children,
  label,
  className,
  description,
  hideLabel = false,
  disabled,
  ...rest
}: SelectProps) => {
  const { inputProps, errorId, showErrorMsg, size, inputDescriptionId } = useFormField(
    rest,
    "select"
  );

  return (
    <div
      data-size={size}
      className={cl(formStyles.field, disabled && formStyles.disabled, className)}
      data-color={color}
      data-error={!!rest.error}
      data-testid="select"
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
      <div className={styles.container}>
        <select
          {...omit(rest, ["error", "errorId", "size", "readOnly"])}
          {...inputProps}
          className={cl(styles.select)}
          disabled={disabled}
        >
          {children}
        </select>
        <ChevronDown className={styles.icon} />
      </div>
      <div className={formStyles.error} id={errorId}>
        {showErrorMsg && <p>{rest.error}</p>}
      </div>
    </div>
  );
};
export default Select;
