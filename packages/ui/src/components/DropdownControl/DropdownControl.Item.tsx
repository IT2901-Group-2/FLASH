import React from "react";
import { type SegmentedControlItemProps } from "../SegmentedControl/parts/ControlItem";

export type DropdownControlItemProps = Omit<SegmentedControlItemProps, "content"> & {
  /**
   * Content shown below the control when this item is selected.
   */
  content?: React.ReactNode;
};

const DropdownControlItem = (_props: DropdownControlItemProps) => null;

DropdownControlItem.displayName = "DropdownControl.Item";

export default DropdownControlItem;
