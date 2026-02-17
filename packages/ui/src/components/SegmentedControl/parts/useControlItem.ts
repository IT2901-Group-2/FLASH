import { useCallback } from "react";
import { useSegmentedControls } from "../useSegmentedControl";

export interface UseToggleItemProps {
  /**
   * If `true`, the `ToggleItem` won't be toggleable
   * @default false
   */
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  value: string;
}

export const useToggleItem = <P extends UseToggleItemProps>({
  value,
  onFocus: _onFocus,
  onClick,
  onKeyDown: _onKeyDown,
}: P) => {
  const { focusedValue, setFocusedValue, selectedValue, setSelectedValue } =
    useSegmentedControls();

  const isSelected = value === selectedValue;
  const onFocus = () => setFocusedValue(value);
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {},
    [focusedValue, selectedValue, setSelectedValue]
  );

  return {
    isSelected,
    isFocused: focusedValue === value,
    onClick,
    onFocus,
    onKeyDown,
  };
};
