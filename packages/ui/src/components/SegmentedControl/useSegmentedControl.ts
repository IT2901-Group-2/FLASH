import { flushSync } from "react-dom";
import { useCallback, useState } from "react";
import { useControllableState } from "@/util/hooks";
import { SegmentedControlProps } from "./SegmentedControl";

export function useSegmentedControl({
  value,
  defaultValue = "",
  onChange,
}: Pick<SegmentedControlProps, "value" | "defaultValue" | "onChange">) {
  const [focusedValue, setFocusedValue] = useState(defaultValue);

  const [selectedValue, _setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange,
  });

  // Keep focusedValue in sync when value is controlled externally.
  if (value != null && value !== focusedValue) setFocusedValue(value);

  const setSelectedValue = useCallback(
    (next: string) => {
      if (!document.startViewTransition) return _setSelectedValue(next);
      document.startViewTransition(() => flushSync(() => _setSelectedValue(next)));
    },
    [_setSelectedValue]
  );

  return {
    selectedValue,
    setSelectedValue,
    focusedValue,
    setFocusedValue,
  };
}
