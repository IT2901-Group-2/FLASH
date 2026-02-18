import { cl, omit } from "@/util/helpers/";
import styles from "../SegmentedControl.module.css";
import { useControlItem } from "./useControlItem";

interface BaseProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Value for state-handling.
   */
  value: string;
  /**
   * If an option is disabled
   */
  disabled?: boolean;
  /**
   * Foreward referance
   */
  ref?: React.ForwardedRef<HTMLButtonElement>;
}

interface LabelProps {
  children?: never;
  /**
   * Item label.
   */
  label: React.ReactNode;
  /**
   * Item Icon.
   */
  icon?: React.ReactNode;
}

interface IconProps {
  children?: never;
  /**
   * Item label.
   */
  label?: React.ReactNode;
  /**
   * Item Icon.
   */
  icon: React.ReactNode;
}

export type SegmentedControlItemProps = BaseProps & (LabelProps | IconProps);

const ControlItem = ({
  value,
  icon,
  label,
  children,
  className,
  ref,
  disabled = false,
  ...rest
}: SegmentedControlItemProps) => {
  const { ...itemProps } = useControlItem({
    ref,
    value,
    disabled,
    ...rest,
  });

  return (
    <button
      {...rest}
      {...omit({ ...itemProps }, ["isFocused", "isSelected"])}
      disabled={disabled}
      className={cl(className, styles.controlButton)}
      type="button"
      role="radio"
    >
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
