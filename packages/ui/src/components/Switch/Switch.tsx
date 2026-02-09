import { InputHTMLAttributes, useEffect, useId, useState } from "react";
import styles from "./Switch.module.css";
import { Loader } from "../Loader";
import { Check, Lock } from "lucide-react";
import { ColorName } from "@/styles/colorType";
import { cl } from "@/util/className";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Switch-label.
   */
  children: React.ReactNode;
  /**
   * If enabled shows the label and description for screenreaders only.
   * @default false
   */
  hideLabel?: boolean;
  /**
   * Toggles loading state with loader-component on switch.
   * @default false
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
   * @default false
   */
  readOnly?: boolean;
  /**
   * Changes font-size, padding and gaps.
   * @default "medium"
   */
  size?: "medium" | "small";
  /**
   * The color the of the switch in the checked/active state.
   * @default "neutral"
   */
  "data-color"?: ColorName;
  /**
   * Override internal id.
   */
  id?: string;
}

/**
 * A switch is used as a toggle to change immediately between two states, often to turn a setting on or off.
 *
 * > _Last updated: `2026-02-07`_
 *
 * ### Suitable for:
 * - Activating/deactivating a status immediately.
 * - On/off switch for e.g. notifications.
 *
 * ### Not suitable for:
 * - Replacing checkboxes or radio buttons in forms.
 * - Statuses that are not saved immediately.
 */
export const Switch = ({
  children,
  className,
  description,
  hideLabel,
  loading,
  checked: checkedProp,
  defaultChecked,
  position = "left",
  readOnly,
  disabled,
  size = "medium",
  id: customID,
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
  const id = customID ?? useId();

  return (
    <div
      className={cl(
        styles.switch,
        styles[`switch--${size}`],
        styles[`${position}`],
        disabled && styles.disabled,
        readOnly && styles.readonly,
        className
      )}
      data-color={color}
      aria-readonly={readOnly}
    >
      <input
        tabIndex={0}
        id={id}
        readOnly={readOnly}
        type="checkbox"
        disabled={disabled ?? loading ?? readOnly}
        checked={checkedProp}
        defaultChecked={defaultChecked}
        onChange={event => {
          if (readOnly) return;
          setChecked(event.target.checked);
          rest.onChange?.(event);
        }}
        className={cl(styles.input)}
        role="switch"
      />
      <span className={styles.track}>
        <span className={styles.thumb}>
          <SwitchIcon size={size} checked={checked} loading={loading} />
        </span>
      </span>
      <label htmlFor={id} className={styles.labelWrapper}>
        <span className={styles.content}>
          {!hideLabel && (
            <span className={styles.label}>
              {readOnly && <Lock size={18} />}
              {children}
            </span>
          )}
          {description && <span className={styles.description}>{description}</span>}
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

  if (size === "small") return <Check strokeWidth={6} size={8} />;
  return <Check strokeWidth={6} size={12} />;
};

export default Switch;
