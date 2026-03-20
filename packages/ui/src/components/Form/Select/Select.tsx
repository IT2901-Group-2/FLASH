import { Children, isValidElement, SelectHTMLAttributes, useState } from "react";
import { FormFieldProps, useFormField } from "../useFormField";
import { cl, omit } from "@/util/helpers";
import formStyles from "../Form.module.css";
import styles from "./Select.module.css";
import { ChevronDown } from "lucide-react";
import SelectOption from "./Select.Option";
import { SelectProvider } from "./Select.context";

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
  ref?: React.Ref<SelectProps>;
}

const Select = ({
  "data-color": color,
  children,
  className,
  label,
  description,
  name,
  value: controlledValue,
  defaultValue,
  hideLabel = false,
  disabled,
  ...rest
}: SelectProps) => {
  const { inputProps, errorId, showErrorMsg, size, inputDescriptionId } = useFormField(
    rest,
    "select"
  );
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(
    String(controlledValue ?? defaultValue ?? "")
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
      <input type="hidden" name={name} value={value} />
      <div
        className={styles.container}
        // ref={containerRef}
      >
        <button
          // ref={triggerRef}
          id={inputProps.id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          // aria-controls={listboxId}
          aria-labelledby={inputProps.id}
          aria-describedby={inputDescriptionId}
          aria-invalid={inputProps["aria-invalid"]}
          aria-required={rest.required}
          disabled={disabled}
          className={cl(styles.trigger, open && styles.open)}
          onClick={() => setOpen(o => !o)}
          // onKeyDown={handleTriggerKeyDown}
          // onBlur={e => {
          //   // Only fire blur if focus left the whole component
          //   if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          //     fireBlur();
          //   }
          // }}
        >
          <span className={styles.triggerValue}>
            {<span className={styles.placeholder}>{"TEMP"}</span>}
          </span>
          <ChevronDown className={cl(styles.icon, open && styles.iconOpen)} />
        </button>

        {open && <ul className={styles.listbox}>{children}</ul>}
      </div>
      <div className={formStyles.error} id={errorId}>
        {showErrorMsg && <p>{rest.error}</p>}
      </div>
    </div>
  );
};

Select.Option = SelectOption;

export default Select;
