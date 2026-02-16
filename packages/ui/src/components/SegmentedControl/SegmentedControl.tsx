import React, { HTMLAttributes } from "react";
import { ColorName } from "@/styles/colorType";
import ControlItem from "./parts/ControlItem";
import { cl } from "@/util/className";
import styles from "./SegmentedControl.module.css";

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
 * > _Last updated: `2026-02-07`_
 */
const SegmentedControl = ({
  children,
  onChange,
  className,
  "data-color": color = "accent",
}: SegmentedControlProps) => {
  return (
    <div className={cl(styles.container, className)} data-color={color}>
      <div role="radiogroup" className={styles.toggleGroup}>
        {children}
      </div>
    </div>
  );
};

SegmentedControl.Item = ControlItem;

export default SegmentedControl;
