import { useCallback, useState } from "react";

interface UseControllableStateProps<T> {
  defaultValue?: T;
  value?: T;
  onChange?: (value: T) => void;
}

/**
 * A custom hook that manages a state value that can be either controlled or uncontrolled. It takes an object with `defaultValue`, `value`, and `onChange` properties, and returns a tuple containing the current value and a setter function. If the `value` prop is provided, the hook will treat the state as controlled and use the `value` prop as the source of truth. If the `value` prop is not provided, the hook will manage its own internal state using the `defaultValue` as the initial value.
 *
 * @template T - The type of the state value being managed by the hook.
 * @param defaultValue - The initial value for the state when it is uncontrolled.
 * @param value - The controlled value for the state. If this prop is provided, the hook will treat the state as controlled.
 * @param onChange - A callback function that is called when the state value changes. This is useful for controlled components to notify the parent component of changes.
 * @returns A tuple containing the current value and a setter function to update the value.
 */
export function useControllableState<T>({
  defaultValue,
  value: controlledValue,
  onChange,
}: UseControllableStateProps<T>) {
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [value, setValue] as const;
}
