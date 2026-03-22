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

type ControlledProps = {
  /**
   * Controlled selected value.
   */
  value: string;
  /**
   * If not controlled, a default-value needs to be set.
   */
  defaultValue?: never;
};

type UncontrolledProps = {
  /**
   * Controlled selected value.
   */
  value?: never;
  /**
   * If not controlled, a default-value needs to be set.
   */
  defaultValue: string;
};

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
    value?: string;
    defaultValue?: string;
    ref?: React.Ref<HTMLInputElement>;
  } & (ControlledProps | UncontrolledProps);

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

  const { inputProps, errorId, showErrorMsg, size, inputDescriptionId } = useFormField(
    rest,
    "select"
  );

  const optionsContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        optionsContainerRef.current &&
        !optionsContainerRef.current.contains(e.target as Node)
      )
        context.setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, optionsContainerRef]);

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
            hidden={hideLabel}
            htmlFor={inputProps.id}
            className={cl(formStyles.label)}
          >
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
            <button
              id={inputProps.id}
              type="button"
              role="combobox"
              disabled={disabled}
              className={cl(styles.trigger, context.open && styles.open)}
              onClick={() => context.setOpen(o => !o)}
            >
              <span className={styles.triggerValue}>
                {<span className={styles.placeholder}>{selectedLabel}</span>}
              </span>
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
