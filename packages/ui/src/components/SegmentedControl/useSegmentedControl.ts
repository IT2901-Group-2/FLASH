import { useState } from "react";
import { SegmentedControlProps } from "./SegmentedControl";

export function useSegmentedControl({
  onChange,
  value,
  defaultValue = "",
}: Pick<SegmentedControlProps, "onChange" | "value" | "defaultValue">) {
  const [focusedValue, setFocusedValue] = useState<string>(defaultValue);
  const [selectedValue, setSelectedValue] = useState<string>("");

  if (value != null && value !== focusedValue) setFocusedValue(value);

  return {
    selectedValue,
    setSelectedValue,
    focusedValue,
    setFocusedValue,
  };
}
