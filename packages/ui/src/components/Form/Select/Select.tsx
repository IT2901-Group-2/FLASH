import { SelectHTMLAttributes } from "react";
import { FormFieldProps } from "../useFormField";

export interface SelectProps
  extends
    FormFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple"> {
  /**
   * Collection of <option />-elements.
   */
  children: React.ReactNode;
  /**
   * Sets inline-style on select wrapper.
   */
  style?: React.CSSProperties;
  /**
   * Label for select.
   */
  label: React.ReactNode;
  /**
   * Shows label and description for screenreaders only.
   */
  hideLabel?: boolean;
}

const Select = ({ ...rest }: SelectProps) => {
  return <div></div>;
};
export default Select;
