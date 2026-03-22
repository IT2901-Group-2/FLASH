import { cl, omit } from "@/util/helpers";
import styles from "../Select.module.css";
import { useSelectOption } from "./useSelectOption";
import { Circle } from "lucide-react";

export interface SelectOption extends Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /**
   * Internal value of this option
   */
  value: string;
  /**
   * The display value of this option
   */
  label: string;
  /**
   * If this option is disabled or not
   */
  disabled?: boolean;
  /**
   * Foreward referance
   */
  ref?: React.ForwardedRef<HTMLButtonElement>;
}

const SelectOption = ({ value, label, disabled, ref, ...rest }: SelectOption) => {
  const { isSelected, ...itemProps } = useSelectOption({
    ref,
    value,
    label,
    disabled,
    ...rest,
  });

  return (
    <button
      {...omit({ ...itemProps }, ["isFocused"])}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      data-selected={isSelected}
      className={cl(styles.option, disabled && styles.disabled)}
    >
      <span className={styles.icon}>
        <Circle />
      </span>
      {label}
    </button>
  );
};

export default SelectOption;
