import { createDescendantContext } from "@/util/hooks/";
import { createStrictContext } from "@/util/helpers";
import { useSegmentedControl } from "./useSegmentedControl";
import { SegmentedControlProps } from "./SegmentedControl";

// Descendant context — gives each item access to the ordered registry.
export const [
  SegmentedControlDescendantsProvider,
  useSegmentedControlDescendantsContext,
  useSegmentedControlDescendants,
  useSegmentedControlDescendant,
] = createDescendantContext<HTMLButtonElement, { value: string }>();

// State context — selected/focused value + setters.
type SegmentedControlContextValue = ReturnType<typeof useSegmentedControl> &
  Pick<SegmentedControlProps, "size">;

export const {
  Provider: SegmentedControlProvider,
  useContext: useSegmentedControlContext,
} = createStrictContext<SegmentedControlContextValue>({
  name: "SegmentedControlContext",
  errorMessage: "<SegmentedControl.Item> must be wrapped within <SegmentedControl>",
});
