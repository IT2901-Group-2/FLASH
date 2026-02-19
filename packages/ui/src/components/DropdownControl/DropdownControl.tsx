import React, { useState } from "react";
import styles from "./DropdownControl.module.css";
import { cl } from "@/util/helpers/";
import { SegmentedControl, SegmentedControlProps } from "../SegmentedControl";
import DropdownControlItem, { DropdownControlItemProps } from "./DropdownControl.Item";

export type DropdownOption = SegmentedControlProps & {
  content?: React.ReactNode;
};

export type DropdownControlProps = SegmentedControlProps & {
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
  children: React.ReactNode;
  /**
   *
   */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * DropdownControls builds on Controls by showing additional content for the
 * active option.
 *
 * > _Last updated: `2026-02-07`_
 */
const DropdownControl = ({
  value: controlledValue,
  defaultValue,
  onChange,
  className,
  "data-color": color = "accent",
  ref,
  ...rest
}: DropdownControlProps) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? "");

  const selectedValue = controlledValue ?? internalValue;

  const handleChange = (val: string) => {
    if (controlledValue === undefined) setInternalValue(val);
    onChange?.(val);
  };

  // Collect only DropdownControl.Item children
  const items = React.Children.toArray(rest.children).filter(
    (child): child is React.ReactElement<DropdownControlItemProps> =>
      React.isValidElement(child) &&
      (child.type as React.FC).displayName === "DropdownControl.Item"
  );

  const activeContent = items.find(item => item.props.value === selectedValue)?.props
    .content;

  return (
    <div
      ref={ref}
      className={cl(styles.dropdownControls, className)}
      data-color={color}
      {...rest}
    >
      <SegmentedControl
        {...rest}
        data-color={color}
        value={selectedValue}
        onChange={handleChange}
        fill
      >
        {items.map(item => (
          <SegmentedControl.Item
            key={item.props.value}
            value={item.props.value}
            label={item.props.label}
            icon={item.props.icon}
            disabled={item.props.disabled}
          />
        ))}
      </SegmentedControl>
      <div className={styles.panel} data-open={!!activeContent}>
        <div className={styles.panelInner}>{activeContent}</div>
      </div>
    </div>
  );
};

DropdownControl.Item = DropdownControlItem;

export default DropdownControl;
