import { cl } from "@/util/helpers/";
import styles from "../SegmentedControl.module.css";
import { useControlItem } from "./useControlItem";
import { useId } from "react";

type BaseProps = Omit<React.HTMLAttributes<HTMLButtonElement>, "children"> & {
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
    "data-size": size,
    transitionId,
    ...itemProps
  } = useControlItem({
    ref,
    value,
    disabled,
    ...rest,
  });

  const innerId = useId();
  const innerTransitionName = `segmented-control-inner-${innerId}`;

  return (
    <button
      {...rest}
      {...itemProps}
      disabled={disabled}
      className={cl(className, styles.controlButton)}
      type="button"
      role="radio"
      data-size={size}
    >
      {isSelected && (
        <div className={styles.backdrop} style={{ viewTransitionName: transitionId }} />
      )}
      <span className={styles.inner} style={{ viewTransitionName: innerTransitionName }}>
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
