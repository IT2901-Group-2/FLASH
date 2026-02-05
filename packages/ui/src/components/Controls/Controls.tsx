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
  /**
   * Inject per-option props (e.g. aria-controls, aria-expanded, id)
   */
  getOptionProps?: (
    option: SegmentedOption<T>,
    index: number,
    active: boolean
  ) => React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const callAll =
  <E,>(...handlers: Array<((event: E) => void) | undefined>) =>
  (event: E) => {
    for (const handler of handlers) {
      handler?.(event);
      if ((event as unknown as { defaultPrevented?: boolean }).defaultPrevented) {
        break;
      }
    }
  };

/**
 * Controls allows the user to select from a set of mutually-exclusive options.
 */
const ControlsInner = <T extends string>(
  {
    options,
    value,
    onChange,
    disabled,
    loading = false,
    variant = "primary",
    "data-color": data = "accent",
    className,
    getOptionProps,
    ...rest
  }: ControlsProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  const groupId = React.useId();
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(0, options?.findIndex(o => o.value === value) ?? 0);
  const optionCount = Math.max(1, options.length);

  if (loading) {
    return (
      <div
        data-color={data}
        data-variant={variant}
        ref={ref}
        className={cl(styles.controls, styles.loading, className)}
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-atomic="true"
        {...rest}
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
      aria-orientation="horizontal"
      aria-disabled={disabled ? true : undefined}
      {...rest}
    >
      <span
        className={styles.indicator}
        style={{
          width: `calc((100% - 0.5rem) / ${optionCount})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
        aria-hidden="true"
      />

      {options.map((opt, index) => {
        const active = opt.value === value;
        const optionProps = getOptionProps?.(opt, index, active) ?? {};
        const optionId = optionProps.id ?? `${groupId}-option-${index}`;

        const handleSelect = () => {
          if (!disabled) onChange?.(opt.value);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (disabled || options.length === 0) return;

          const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
          if (keys.includes(e.key)) e.preventDefault();

          let nextIndex = index;

          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            nextIndex = (index + 1) % options.length;
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            nextIndex = (index - 1 + options.length) % options.length;
          } else if (e.key === "Home") {
            nextIndex = 0;
          } else if (e.key === "End") {
            nextIndex = options.length - 1;
          } else if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleSelect();
            return;
          } else {
            return;
          }

          const nextOption = options[nextIndex];
          if (nextOption) onChange?.(nextOption.value);
          buttonRefs.current[nextIndex]?.focus();
        };

        return (
          <button
            key={opt.value}
            id={optionId}
            ref={el => (buttonRefs.current[index] = el)}
            type="button"
            className={cl(styles.item, active && styles.active)}
            disabled={disabled ? true : undefined}
            role="radio"
            aria-checked={active}
            aria-disabled={disabled ? true : undefined}
            tabIndex={active ? 0 : -1}
            onClick={callAll(optionProps.onClick, handleSelect)}
            onKeyDown={callAll(optionProps.onKeyDown, handleKeyDown)}
            {...optionProps}
          >
            <span className={cl(active && styles.active)}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const Controls = React.forwardRef(ControlsInner) as <T extends string>(
  props: ControlsProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;

export default Controls;
