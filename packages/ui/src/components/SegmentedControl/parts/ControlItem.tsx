import { cl } from "@/util/className";
import styles from "../SegmentedControl.module.css";

type BaseProps = Omit<React.HTMLAttributes<HTMLButtonElement>, "children"> & {
  /**
   * Value for state-handling.
   */
  value: string;
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
  ...rest
}: ControlItemProps) => {
  return (
    <button
      {...rest}
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
export default ControlItem;
