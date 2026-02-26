import React, { HTMLAttributes, useId } from "react";
import { ColorName } from "@/styles/colorType";
import ControlItem from "./parts/ControlItem";
import { cl } from "@/util/helpers/";
import styles from "./SegmentedControl.module.css";
import {
  SegmentedControlDescendantsProvider,
  SegmentedControlProvider,
  useSegmentedControlDescendants,
} from "./SegmentedControl.context";
import { useSegmentedControl } from "./useSegmentedControl";

type ControlledProps = {
  /**
   * Controlled selected value.
   */
  value: string;
  /**
   * If not controlled, a default-value needs to be set.
   */
  defaultValue?: never;
};

type UncontrolledProps = {
  /**
   * Controlled selected value.
   */
  value?: never;
  /**
   * If not controlled, a default-value needs to be set.
   */
  defaultValue: string;
};

export type SegmentedControlProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "dir"
> & {
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
   * Callback for selected toggle.
   */
  onChange?: (value: string) => void;
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
} & (ControlledProps | UncontrolledProps);

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
  size = "medium",
  "data-color": color = "accent",
}: SegmentedControlProps) => {
  const context = useSegmentedControl({ defaultValue, value, onChange });
  const descendants = useSegmentedControlDescendants();
  const labelId = useId();

  const cssVars = {
    "--item-count": React.Children.count(children),
    "--selected-index": descendants
      .values()
      .findIndex(d => d.value === context.selectedValue),
  } as React.CSSProperties;

  return (
    <SegmentedControlDescendantsProvider manager={descendants}>
      <SegmentedControlProvider value={{ ...context, size }}>
        <div
          className={cl(styles.container, className)}
          data-color={color}
          data-fill={fill}
          data-size={size}
          data-testid="segmentedControl"
          style={cssVars}
        >
          {label && (
            <div id={labelId} className={styles.label}>
              {label}
            </div>
          )}
          <div
            role="radiogroup"
            aria-labelledby={label ? labelId : undefined}
            className={styles.toggleGroup}
          >
            <div className={styles.backdrop} />
            {children}
          </div>
        </div>
      </SegmentedControlProvider>
    </SegmentedControlDescendantsProvider>
  );
};

SegmentedControl.Item = ControlItem;

export default SegmentedControl;
