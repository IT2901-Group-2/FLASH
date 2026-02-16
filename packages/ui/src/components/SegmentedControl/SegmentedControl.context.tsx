import { createContext, PropsWithChildren } from "react";
import { SegmentedControlProps } from "./SegmentedControl";
import { useSegmentedControls } from "./useSegmentedControl";

interface SegmentedControlContextType {
  size: "medium" | "small";
  focusedValue: string;
  setFocusedValue: (_: string) => string;
}

const SegmentedControlContext = createContext<SegmentedControlContextType | undefined>(
  undefined
);

type SegmentedControlProviderProps = ReturnType<typeof useSegmentedControls> &
  Pick<SegmentedControlProps, "size"> &
  PropsWithChildren;

export const SegmentedControlsProvider = ({
  children,
  focusedValue,
  setFocusedValue,
  size,
}: SegmentedControlProviderProps) => {
  const value: SegmentedControlContextType = {
    size: "medium",
    focusedValue,
    setFocusedValue,
  };

  return (
    <SegmentedControlContext.Provider value={value}>
      {children}
    </SegmentedControlContext.Provider>
  );
};
