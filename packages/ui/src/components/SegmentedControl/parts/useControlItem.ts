import { useCallback } from "react";
import { composeEventHandlers } from "@/util/helpers";
import { useMergeRefs } from "@/util/hooks";
import {
  useSegmentedControlContext,
  useSegmentedControlDescendant,
} from "../SegmentedControl.context";

export interface UseControlItemProps {
  value: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  ref?: React.ForwardedRef<HTMLButtonElement>;
}

export function useControlItem({
  value,
  disabled = false,
  onClick,
  onFocus: _onFocus,
  onKeyDown: _onKeyDown,
  ref,
}: UseControlItemProps) {
  const { selectedValue, setSelectedValue, focusedValue, setFocusedValue, size } =
    useSegmentedControlContext();

  const { register, descendants } = useSegmentedControlDescendant({
    value,
    disabled,
  });

  const isSelected = value === selectedValue;

  const onFocus = () => setFocusedValue(value);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Find the index of the currently focused item in the sorted list.
      const idx = descendants.values().findIndex(d => d.value === focusedValue);

      const focusItem = (item?: { node: HTMLButtonElement }) => item?.node?.focus();

      const keyMap: Record<string, () => void> = {
        ArrowRight: () => focusItem(descendants.nextEnabled(idx, false)),
        ArrowLeft: () => focusItem(descendants.prevEnabled(idx, false)),
        Home: () => focusItem(descendants.firstEnabled()),
        End: () => focusItem(descendants.lastEnabled()),
      };

      const hasModifiers =
        event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
      const action = keyMap[event.key];

      if (action && !hasModifiers) {
        event.preventDefault();
        action();
      } else if (event.key === "Tab" && selectedValue)
        setTimeout(() => setFocusedValue(selectedValue));
    },
    [descendants, focusedValue, selectedValue, setFocusedValue]
  );

  const refs = useMergeRefs(register, ref);

  return {
    ref: refs,
    isSelected,
    isFocused: focusedValue === value,
    "aria-checked": isSelected,
    onClick: composeEventHandlers(
      onClick,
      () => selectedValue !== value && setSelectedValue(value)
    ),
    onFocus: disabled ? undefined : composeEventHandlers(_onFocus, onFocus),
    onKeyDown: composeEventHandlers(_onKeyDown, onKeyDown),
    "data-size": size,
  };
}
