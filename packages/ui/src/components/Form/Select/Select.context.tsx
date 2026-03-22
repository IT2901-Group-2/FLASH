import { createDescendantContext } from "@/util/hooks/";
import { createStrictContext } from "@/util/helpers";
import { useSelect } from "./useSelect";
import { SelectProps } from "./Select";

// Descendant context — gives each item access to the ordered registry.
export const [
  SelectDescendantsProvider,
  useSelectDescendantsContext,
  useSelectDescendants,
  useSelectDescendant,
] = createDescendantContext<HTMLButtonElement, { value: string; label: string }>();

// State context — selected/focused value + setters.
type SelectContextValue = ReturnType<typeof useSelect> & Pick<SelectProps, "size">;

export const { Provider: SelectProvider, useContext: useSelectContext } =
  createStrictContext<SelectContextValue>({
    name: "SelectContext",
    errorMessage: "<Select.Item> must be wrapped within <Select>",
  });
