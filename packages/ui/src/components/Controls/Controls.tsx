import React from "react";
import styles from "./Controls.module.css";
import { cl } from "../../util/className";
import { ColorName } from "@/styles/colorType";
import { Loader } from "../Loader/Loader";

export type SegmentedOption<T extends string> = {
  value: T;
  label: React.ReactNode;
};

export interface ControlsProps<T extends string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /**
   * Changes design and interaction-visuals.
   * As of now, there only exists styling for the primary variant
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "tertiary";
  /**
   *  **Avoid using if possible for accessibility purposes**.
   *
   * Prevent the user from interacting with the button: it cannot be pressed or focused.
   */
  disabled?: boolean;
  /**
   * Replaces controls component with a Loader component, keeps width.
   * @default false
   */
  loading?: boolean;
  /**
   * Overrides inherited color
   */
  "data-color"?: ColorName;
  /**
   * The currently selected value
   */
  value?: T;
  /**
   * The options to choose from
   */
  options: readonly SegmentedOption<T>[];
  /**
   * Ref to the controls element
   */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Called when the selected value changes
   */
  onChange?: (value: T) => void;
}

/**
 * Controls allows the user to select from a set of mutually-exclusive options.
 */
export const Controls = <T extends string>({
  options,
  value,
  onChange,
  disabled,
  loading = false,
  variant = "primary",
  "data-color": data = "accent",
  className,
  ref,
}: ControlsProps<T>) => {
  const activeIndex = Math.max(0, options?.findIndex(o => o.value === value) ?? 0);

  if (loading) {
    return (
      <div
        data-color={data}
        data-variant={variant}
        ref={ref}
        className={cl(styles.controls, styles.loading, className)}
        role="status"
        aria-busy="true"
      >
        <Loader size="medium" />
      </div>
    );
  }

  return (
    <div
      data-color={data}
      data-variant={variant}
      ref={ref}
      className={cl(styles.controls, disabled && styles.disabled, className)}
      role="radiogroup"
      aria-disabled={disabled ? true : undefined}
    >
      <span
        className={styles.indicator}
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
        aria-hidden="true"
      />

      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={cl(styles.item, active && styles.active)}
            disabled={disabled ? true : undefined}
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => !disabled && onChange && onChange(opt.value)}
            onKeyUp={e => {
              if (e.key === " " && !disabled) e.currentTarget.click();
            }}
          >
            <span className={cl(active && styles.active)}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
export default Controls;
