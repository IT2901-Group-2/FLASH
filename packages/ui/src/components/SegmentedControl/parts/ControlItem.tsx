import { cl } from "@/util/helpers/";
import styles from "../SegmentedControl.module.css";
import { useControlItem } from "./useControlItem";
import { useSegmentedControlContext } from "../SegmentedControl.context";
import { useId } from "react";

type BaseProps = Omit<React.HTMLAttributes<HTMLButtonElement>, "children"> & {
  /**
   * Value for state-handling.
   */
  value: string;
  disabled?: boolean;
  ref?: React.ForwardedRef<HTMLButtonElement>;
};

type LabelProps = {
  children?: never;
  /**
   * Item label.
   */
  label: React.ReactNode;
  /**
   * Item Icon.
   */
  icon?: React.ReactNode;
};

type IconProps = {
  children?: never;
  /**
   * Item label.
   */
  label?: React.ReactNode;
  /**
   * Item Icon.
   */
  icon: React.ReactNode;
};

export type ControlItemProps = BaseProps & (LabelProps | IconProps);

const ControlItem = ({
  value,
  icon,
  label,
  children,
  className,
  ref,
  disabled = false,
  ...rest
}: ControlItemProps) => {
  const {
    isSelected,
    isFocused: _,
    ...itemProps
  } = useControlItem({
    ref,
    value,
    disabled,
    ...rest,
  });

  return (
    <button
      {...rest}
      {...itemProps}
      disabled={disabled}
      className={cl(className, styles.controlButton)}
      type="button"
      role="radio"
    >
      {isSelected && <span className={styles.backdrop} aria-hidden />}
      <span className={styles.inner}>
        {children ?? (
          <>
            {icon}
            {label}
          </>
        )}
      </span>
    </button>
  );
};
ControlItem.displayName = "SegmentedControl.Item";
export default ControlItem;
