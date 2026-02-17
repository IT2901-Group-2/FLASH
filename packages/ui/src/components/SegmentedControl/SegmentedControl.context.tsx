import { createContext, Dispatch, PropsWithChildren, SetStateAction } from "react";
import { SegmentedControlProps } from "./SegmentedControl";
import { useSegmentedControls } from "./useSegmentedControl";

interface SegmentedControlContextType {
  size: "medium" | "small";
  focusedValue: string;
  setFocusedValue: Dispatch<SetStateAction<string>>;
}

export const SegmentedControlContext = createContext<
  SegmentedControlContextType | undefined
>(undefined);

type SegmentedControlProviderProps = ReturnType<typeof useSegmentedControls> &
  Pick<SegmentedControlProps, "size"> &
  PropsWithChildren;

export const SegmentedControlsProvider = ({
  children,
  focusedValue,
  setFocusedValue,
  size: specifiedSize,
}: SegmentedControlProviderProps) => {
  const value: SegmentedControlContextType = {
    size: specifiedSize ?? "medium",
    focusedValue,
    setFocusedValue,
  };

  return (
    <SegmentedControlContext.Provider value={value}>
      {children}
    </SegmentedControlContext.Provider>
  );
};
