import React, { HTMLAttributes, useId } from "react";
import { ColorName } from "@/styles/colorType";
import ControlItem from "./parts/ControlItem";
import { cl } from "@/util/helpers/";
import styles from "./SegmentedControl.module.css";
import { SegmentedControlsProvider } from "./SegmentedControl.context";
import { useSegmentedControls } from "./useSegmentedControl";

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "dir"
> {
  /**
   * SegmentedControl.Item elements.
   */
  children: React.ReactNode;
  /**
   * Changes padding and font-size.
   * @default "medium"
   */
  size?: "medium" | "small";
  /**
   * Controlled selected value.
   */
  value?: string;
  /**
   * If not controlled, a default-value needs to be set.
   */
  defaultValue?: string;
  /**
   * Callback for selected toggle.
   */
  onChange: (value: string) => void;
  /**
   * Label describing SegmentedControl.
   */
  label?: React.ReactNode;
  /**
   * Overrides inherited color
   */
  "data-color"?: ColorName;
  /**
   * Stretch each button to fill avaliable space in container.
   * @default false
   */
  fill?: boolean;
}

/**
 * Controls allows the user to select from a set of mutually-exclusive options.
 *
 * > _Last updated: `2026-02-16`_
 */
const SegmentedControl = ({
  defaultValue,
  value,
  children,
  onChange,
  className,
  label,
  fill = false,
  size,
  "data-color": color = "accent",
}: SegmentedControlProps) => {
  if (!value && !defaultValue)
    console.error("ToggleGroup without value or defaultvalue is not allowed");

  const SegmentedControlsContext = useSegmentedControls({
    defaultValue,
    value,
    onChange,
  });

  const context = {
    ...SegmentedControlsContext,
    size,
  };

  const lableID = useId();

  return (
    <SegmentedControlsProvider {...context}>
      <div
        className={cl(styles.container, className)}
        data-color={color}
        data-fill={fill}
      >
        {label && (
          <div id={lableID} className={styles.label}>
            {label}
          </div>
        )}
        <div role="radiogroup" className={styles.toggleGroup}>
          {children}
        </div>
      </div>
    </SegmentedControlsProvider>
  );
};

SegmentedControl.Item = ControlItem;

export default SegmentedControl;
