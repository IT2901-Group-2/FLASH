import React from "react";
import { SegmentedControlProps } from "../SegmentedControl";

export interface DropdownControlsItemProps extends Omit<
  SegmentedControlProps,
  "options" | "value" | "onChange"
> {
  /**
   * The currently of this option
   */
  value: string;
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
const DropdownControlItem = ({ value, ref }: DropdownControlsItemProps) => {};

export default DropdownControlItem;
