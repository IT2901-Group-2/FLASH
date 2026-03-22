import { useEffect, useState } from "react";
import { useControllableState } from "@/util/hooks";
import { SelectProps } from "./Select";

export function useSelect({
  value,
  defaultValue,
  onChange,
}: Pick<SelectProps, "value" | "defaultValue" | "onChange">) {
  const [open, setOpen] = useState(false);
  const [focusedValue, setFocusedValue] = useState(defaultValue);
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: onChange
      ? (val: string) =>
          onChange({ target: { value: val } } as React.ChangeEvent<HTMLSelectElement>)
      : undefined,
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
    open,
    setOpen,
  };
}
