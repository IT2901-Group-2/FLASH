import { InputHTMLAttributes, useEffect, useRef } from "react";
import { FormFieldProps, useFormField } from "../useFormField";
import { cl } from "@/util/helpers";
import formStyles from "../Form.module.css";
import styles from "./Select.module.css";
import { ChevronDown } from "lucide-react";
import SelectOption from "./option/Select.option";
import {
  SelectDescendantsProvider,
  SelectProvider,
  useSelectDescendants,
} from "./Select.context";
import { useSelect } from "./useSelect";

export type SelectProps = FormFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "multiple"> & {
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
    /**
     * value for when the component is externaly controled.
     */
    value?: string;
    /**
     * A default value for the component
     */
    defaultValue?: string;
  };

const Select = ({
  children,
  className,
  label,
  description,
  value,
  defaultValue,
  onChange,
  hideLabel = false,
  disabled,
  name,
  ...rest
}: SelectProps) => {
  const context = useSelect({ defaultValue, value, onChange, name });
  const descendants = useSelectDescendants();
  const selectedLabel = descendants
    .values()
    .find(d => d.value === context.selectedValue)?.label;

  const { inputProps, errorId, showErrorMsg, size } = useFormField(rest, "select");

  const optionsContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!context.open) return;
    const handler = (e: MouseEvent) => {
      if (
        optionsContainerRef.current &&
        !optionsContainerRef.current.contains(e.target as Node)
      )
        context.setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [context.open, context.setOpen]);

  return (
    <SelectDescendantsProvider manager={descendants}>
      <SelectProvider value={{ ...context, size }}>
        <div
          data-size={size}
          className={cl(formStyles.field, disabled && formStyles.disabled, className)}
          data-error={!!rest.error}
          data-testid="select"
        >
          <label
            data-testid="mainLabel"
            hidden={hideLabel}
            htmlFor={inputProps.id}
            className={cl(formStyles.label)}
          >
            {label}
            {rest.required && <span className={formStyles.requiredStar}>*</span>}
          </label>
          {!!description && (
            <div hidden={hideLabel} className={formStyles.description}>
              {description}
            </div>
          )}
          <div className={styles.container}>
            <button
              id={inputProps.id}
              type="button"
              role="combobox"
              aria-invalid={!!rest.error}
              disabled={disabled}
              className={cl(styles.trigger, context.open && styles.open)}
              onClick={() => context.setOpen(true)}
            >
              <span className={styles.triggerValue}>{selectedLabel}</span>
              <ChevronDown className={cl(styles.icon, context.open && styles.iconOpen)} />
            </button>

            <ul
              data-open={context.open}
              className={styles.listbox}
              ref={optionsContainerRef}
            >
              <label className={cl(formStyles.label, styles.mobileLabel)}>{label}</label>
              {children}
            </ul>
          </div>
          <div className={formStyles.error} id={errorId}>
            {showErrorMsg && <p>{rest.error}</p>}
          </div>
        </div>
      </SelectProvider>
    </SelectDescendantsProvider>
  );
};

Select.Option = SelectOption;

export default Select;
