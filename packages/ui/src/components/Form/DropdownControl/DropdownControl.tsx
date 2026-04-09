import React, { useState } from "react";
import styles from "./DropdownControl.module.css";
import formStyles from "../Form.module.css";
import { cl, omit } from "@/util/helpers";
import { SegmentedControl, SegmentedControlProps } from "../SegmentedControl";
import DropdownControlItem, { DropdownControlItemProps } from "./DropdownControl.Item";
import { useFormField } from "../useFormField";

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
   * If the dropdown content has a border arount it.
   * @default false
   */
  dropdownBorder?: boolean;
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
  dropdownBorder = false,
  ref,
  ...rest
}: DropdownControlProps) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? "");
  const { errorId, showErrorMsg } = useFormField(rest, "dropdownControl");

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
      data-error={!!rest.error}
      {...rest}
    >
      <SegmentedControl
        {...omit({ ...rest }, ["error"])}
        data-color={color}
        value={selectedValue}
        onChange={handleChange}
        fill
        data-testid="dropdown-control-segmented"
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
      <div
        className={cl(dropdownBorder && styles.dropdownBorder, styles.panel)}
        data-open={!!activeContent}
      >
        <div className={styles.panelInner}>{activeContent}</div>
      </div>
      <div className={formStyles.error} id={errorId}>
        {showErrorMsg && <p>{rest.error}</p>}
      </div>
    </div>
  );
};

DropdownControl.Item = DropdownControlItem;

export default DropdownControl;
