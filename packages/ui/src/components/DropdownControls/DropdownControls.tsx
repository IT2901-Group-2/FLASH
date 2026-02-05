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
const DropdownControlsInner = <T extends string>(
  {
    options,
    value,
    defaultValue,
    onChange,
    className,
    variant = "primary",
    "data-color": data = "accent",
    ...rest
  }: DropdownControlsProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  const initial = defaultValue ?? options[0]?.value;
  const [internalValue, setInternalValue] = React.useState<T | undefined>(initial);

  React.useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const activeValue = value ?? internalValue;
  const activeOption = options.find(o => o.value === activeValue);
  const expanded = Boolean(activeOption?.content);

  const optionIdBase = React.useId();
  const contentId = React.useId();
  const activeIndex = options.findIndex(o => o.value === activeValue);
  const activeOptionId = activeIndex >= 0 ? `${optionIdBase}-${activeIndex}` : undefined;

  const handleChange = (v: T) => {
    if (value === undefined) setInternalValue(v);
    onChange?.(v);
  };

  return (
    <div
      data-color={data}
      data-variant={variant}
      data-expanded={expanded}
      className={cl(styles.dropdownControls, className)}
      ref={ref}
    >
      <Controls
        {...rest}
        variant={variant}
        data-color={data}
        options={options}
        value={activeValue}
        onChange={handleChange}
        getOptionProps={(opt, index) => ({
          id: `${optionIdBase}-${index}`,
          "aria-controls": opt.content ? contentId : undefined,
        })}
        className={cl(controlsStyles.embedded, expanded && controlsStyles.inactiveOption)}
      />

      <div
        id={contentId}
        className={styles.content}
        role="region"
        aria-live="polite"
        aria-labelledby={activeOptionId}
      >
        <div className={styles.contentInner}>{activeOption?.content}</div>
      </div>
    </div>
  );
};

export const DropdownControls = React.forwardRef(DropdownControlsInner) as <
  T extends string,
>(
  props: DropdownControlsProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;

export default DropdownControls;
