import { composeEventHandlers } from "@/util/helpers";
import { useMergeRefs } from "@/util/hooks";
import { useSelectContext, useSelectDescendant } from "../Select.context";

export interface UseControlItemProps {
  value: string;
  label: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  ref?: React.ForwardedRef<HTMLButtonElement>;
}

export function useSelectOption({
  value,
  label,
  disabled = false,
  onClick,
  onFocus: _onFocus,
  onKeyDown: _onKeyDown,
  ref,
}: UseControlItemProps) {
  const {
    selectedValue,
    setSelectedValue,
    focusedValue,
    setFocusedValue,
    size,
    setOpen,
  } = useSelectContext();

  const { register } = useSelectDescendant({
    value,
    label,
    disabled,
  });

  const isSelected = value === selectedValue;

  const onFocus = () => setFocusedValue(value);

  const refs = useMergeRefs(register, ref);

  return {
    ref: refs,
    isSelected,
    isFocused: focusedValue === value,
    "aria-checked": isSelected,
    onClick: composeEventHandlers(onClick, e => {
      e.preventDefault();
      if (selectedValue !== value) setSelectedValue(value);
      setOpen(false);
    }),
    onFocus: disabled ? undefined : composeEventHandlers(_onFocus, onFocus),
    onKeyDown: composeEventHandlers(_onKeyDown),
    "data-size": size,
  };
}
