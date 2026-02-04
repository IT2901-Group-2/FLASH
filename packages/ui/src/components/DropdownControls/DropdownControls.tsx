import React from "react";
import styles from "./DropdownControls.module.css";
import { cl } from "@/util/className";
import { Controls } from "../Controls";
import type { ControlsProps, SegmentedOption } from "../Controls/Controls";
import controlsStyles from "../Controls/Controls.module.css";

export type DropdownOption<T extends string> = SegmentedOption<T> & {
  content?: React.ReactNode;
};

export interface DropdownControlsProps<T extends string> extends Omit<
  ControlsProps<T>,
  "options" | "value" | "onChange"
> {
  /**
   * The options to choose from
   */
  options: readonly DropdownOption<T>[];
  /**
   * The currently selected value
   */
  value?: T;
  /**
   * The default selected value
   */
  defaultValue?: T;
  /**
   * Called when the selected value changes
   */
  onChange?: (value: T) => void;
}

/**
 * DropdownControls builds on Controls by showing additional content
 * for the active option.
 */
export const DropdownControls = <T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  className,
  variant = "primary",
  "data-color": data = "accent",
  ...rest
}: DropdownControlsProps<T>) => {
  const initial = defaultValue ?? options[0]?.value;
  const [internalValue, setInternalValue] = React.useState<T | undefined>(initial);

  const activeValue = value ?? internalValue;
  const activeOption = options.find(o => o.value === activeValue);
  const expanded = Boolean(activeOption?.content);

  const handleChange = (v: T) => {
    setInternalValue(v);
    onChange?.(v);
  };

  return (
    <div
      data-color={data}
      data-variant={variant}
      data-expanded={expanded}
      className={cl(styles.dropdownControls, className)}
    >
      <Controls
        {...rest}
        variant={variant}
        data-color={data}
        options={options}
        value={activeValue}
        onChange={handleChange}
        className={cl(controlsStyles.embedded, expanded && controlsStyles.inactiveOption)}
      />

      <div className={styles.content} role="region" aria-live="polite">
        <div className={styles.contentInner}>{activeOption?.content}</div>
      </div>
    </div>
  );
};

export default DropdownControls;
