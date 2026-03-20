import { cl } from "@/util/helpers";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  // Injected by Select — don't pass these manually
  selected?: boolean;
  onSelect?: (value: string) => void;
}

const SelectOption = ({ value, label, disabled, selected, onSelect }: SelectOption) => (
  <li
    role="option"
    aria-selected={selected}
    aria-disabled={disabled}
    tabIndex={disabled ? -1 : 0}
    className={cl(
      styles.option,
      selected && styles.selected,
      disabled && styles.disabled
    )}
    onClick={() => !disabled && onSelect?.(value)}
    onKeyDown={e => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        onSelect?.(value);
        e.preventDefault();
      }
    }}
  >
    {label}
  </li>
);

export default SelectOption;
