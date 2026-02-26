import { useEffect, useState } from "react";
import { useControllableState } from "@/util/hooks";
import { SegmentedControlProps } from "./SegmentedControl";

export function useSegmentedControl({
  value,
  defaultValue,
  onChange,
}: Pick<SegmentedControlProps, "value" | "defaultValue" | "onChange">) {
  const [focusedValue, setFocusedValue] = useState(defaultValue);

  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange,
  });

  // Keep focusedValue in sync when value is controlled externally.
  useEffect(() => {
    if (value != null && value !== focusedValue) setFocusedValue(value);
  }, [value, focusedValue]);

  return {
    selectedValue,
    setSelectedValue,
    focusedValue,
    setFocusedValue,
  };
}
