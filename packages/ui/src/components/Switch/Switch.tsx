import { InputHTMLAttributes, useEffect, useState } from "react";
import styles from "./Switch.module.css";
import { Loader } from "../Loader";
import { Check } from "lucide-react";
import { ColorName } from "@/styles/colorType";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Switch-label.
   */
  children: React.ReactNode;
  /**
   * If enabled shows the label and description for screenreaders only.
   */
  hideLabel?: boolean;
  /**
   * Toggles loading state with loader-component on switch.
   */
  loading?: boolean;
  /**
   * Positions switch on left/right side of label.
   * @default "left"
   */
  position?: "left" | "right";
  /**
   * Adds a description to extend labeling of Switch.
   */
  description?: string;
  /**
   * **Avoid using if possible for accessibility purposes**.
   *
   * Disables element.
   */
  disabled?: boolean;
  /**
   * Read-only state.
   */
  readOnly?: boolean;
  /**
   * Changes font-size, padding and gaps.
   */
  size?: "medium" | "small";
  "data-color"?: ColorName;
}

export const Switch = ({
  children,
  className,
  description,
  hideLabel = false,
  loading,
  checked: checkedProp,
  defaultChecked,
  position = "left",
  readOnly,
  disabled,
  size,
  "data-color": color = "neutral",
  ...rest
}: SwitchProps) => {
  const [_checked, setChecked] = useState<boolean>(
    defaultChecked ?? checkedProp ?? false
  );

  useEffect(() => {
    if (checkedProp !== undefined) setChecked(checkedProp);
  }, [checkedProp]);

  const checked = checkedProp ?? _checked;

  return (
    <div className={styles.switch} data-color={color}>
      <input
        type="checkbox"
        disabled={disabled ?? loading}
        checked={checkedProp}
        defaultChecked={defaultChecked}
        onChange={event => {
          if (readOnly) return;
          setChecked(event.target.checked);
          rest.onChange?.(event);
        }}
        className={styles.input}
      />
      <span className={styles.track}>
        <span className={styles.thumb}>
          <SwitchIcon size={size} checked={checked} loading={loading} />
        </span>
      </span>
      <label htmlFor="" className={styles.label}>
        <span className={styles.content}>
          <span>{children}</span>
        </span>
      </label>
    </div>
  );
};

const SwitchIcon = ({
  size,
  checked,
  loading,
}: {
  size: SwitchProps["size"];
  checked: SwitchProps["checked"];
  loading: SwitchProps["loading"];
}) => {
  if (loading) {
    return <Loader />;
  }

  if (!checked) return null;

  if (size === "small") return <Check strokeWidth={4} size={8} />;
  return <Check strokeWidth={6} size={12} />;
};

export default Switch;
