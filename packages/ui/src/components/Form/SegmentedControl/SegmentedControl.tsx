import React, { HTMLAttributes } from "react";
import ControlItem from "./parts/ControlItem";
import { cl } from "@/util/helpers";
import styles from "./SegmentedControl.module.css";
import formStyles from "../Form.module.css";
import {
  SegmentedControlDescendantsProvider,
  SegmentedControlProvider,
  useSegmentedControlDescendants,
} from "./SegmentedControl.context";
import { useSegmentedControl } from "./useSegmentedControl";
import { ColorName } from "@/components/types";
import { FormFieldProps, useFormField } from "../useFormField";

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

export type SegmentedControlProps = FormFieldProps &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "dir"> & {
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
     * A description for the control
     */
    description?: React.ReactNode;
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
  description,
  fill = false,
  "data-color": color = "accent",
  ...rest
}: SegmentedControlProps) => {
  const context = useSegmentedControl({ defaultValue, value, onChange });
  const descendants = useSegmentedControlDescendants();

  const { inputProps, errorId, showErrorMsg, size, inputDescriptionId } = useFormField(
    rest,
    "segmentedControl"
  );

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
          data-error={!!rest.error}
          style={cssVars}
          {...rest}
        >
          {label && (
            <label htmlFor={inputProps.id} className={styles.label}>
              {label}
            </label>
          )}
          {!!description && (
            <div className={formStyles.description} id={inputDescriptionId}>
              {description}
            </div>
          )}
          <div
            role="radiogroup"
            aria-labelledby={label ? inputProps.id : undefined}
            className={styles.toggleGroup}
          >
            <div className={styles.backdrop} />
            {children}
          </div>
        </div>
        <div className={formStyles.error} id={errorId}>
          {showErrorMsg && <p>{rest.error}</p>}
        </div>
      </SegmentedControlProvider>
    </SegmentedControlDescendantsProvider>
  );
};

SegmentedControl.Item = ControlItem;

export default SegmentedControl;
