import { useState } from "react";
import { SegmentedControlProps } from "./SegmentedControl";

export function useSegmentedControls({
  onChange,
  value,
  defaultValue = "",
}: Pick<SegmentedControlProps, "onChange" | "value" | "defaultValue">) {
  const [focusedValue, setFocusedValue] = useState<string>(defaultValue);

  if (value != null && value !== focusedValue) setFocusedValue(value);

  return {
    // selectedValue,
    // setSelectedValue,
    focusedValue,
    setFocusedValue,
  };
}
