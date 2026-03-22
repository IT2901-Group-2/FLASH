import { useEffect, useState } from "react";
import { useControllableState } from "@/util/hooks";
import { SelectProps } from "./Select";

export function useSelect({
  value,
  defaultValue,
  onChange,
  name,
}: Pick<SelectProps, "value" | "defaultValue" | "onChange" | "name">) {
  const [open, setOpen] = useState(false);
  const [focusedValue, setFocusedValue] = useState(defaultValue);
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue,
    value,
    onChange: onChange
      ? (val: string) => {
          console.log(onChange, val);
          onChange({
            target: { value: val, name },
          } as React.ChangeEvent<HTMLInputElement>);
        }
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
