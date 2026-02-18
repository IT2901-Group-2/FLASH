import React from "react";
import styles from "./DropdownControls.module.css";
import { cl } from "@/util/helpers/";
import { SegmentedControl, SegmentedControlProps } from "../SegmentedControl";

export type DropdownOption = SegmentedControlProps & {
  content?: React.ReactNode;
};

export interface DropdownControlsProps extends Omit<
  SegmentedControlProps,
  "options" | "value" | "onChange"
> {
  /**
   * The currently selected value
   */
  value?: string;
  /**
   * The default selected value
   */
  defaultValue?: string;
  /**
   * Called when the selected value changes
   */
  onChange?: (value: string) => void;
  /**
   * The options in the dropdown
   */
  children?: React.ReactNode;
  /**
   *
   */
  ref: React.Ref<HTMLDivElement>;
}

/**
 * DropdownControls builds on Controls by showing additional content for the
 * active option.
 *
 * > _Last updated: `2026-02-07`_
 */
const DropdownControl = ({
  options,
  value,
  defaultValue,
  onChange,
  className,
  "data-color": data = "accent",
  ref,
  ...rest
}: DropdownControlsProps) => {
  return (
    <div
      ref={ref}
      className={cl(styles.dropdownControls, className)}
      data-color={data}
      {...rest}
    >
      <SegmentedControl
        options={options.map(({ content, ...option }) => option)}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
      <div className={styles.dropdownContent}>
        {options.find(option => option.value === value)?.content}
      </div>
    </div>
  );
};

export default DropdownControl;
