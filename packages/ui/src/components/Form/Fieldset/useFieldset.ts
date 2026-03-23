import { cl } from "@/util/helpers";
import { type FormFieldProps, useFormField } from "../useFormField";

/**
 * Handles props for Fieldset in context with parent Fieldset.
 */
export const useFieldset = (props: FormFieldProps, legendId: string) => {
  const formField = useFormField(props, "fieldset");

  return {
    ...formField,
    inputProps: {
      "aria-labelledby": cl(legendId, {
        [formField.inputDescriptionId]: props.description,
      }),
    },
  };
};
