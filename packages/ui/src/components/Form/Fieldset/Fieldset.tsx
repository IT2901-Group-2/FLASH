import React, { FieldsetHTMLAttributes, useContext, useId } from "react";
import { cl, omit } from "@/util/helpers";
import { FormFieldProps } from "../useFormField";
import { FieldsetContext } from "./Fieldset.context";
import { useFieldset } from "./useFieldset";

export interface FieldsetProps
  extends FormFieldProps, FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /**
   * FormFields in Fieldset
   */
  children: React.ReactNode;
  /**
   * Fieldset legend
   */
  legend: React.ReactNode;
  /**
   * If enabled shows the legend and description for screenreaders only
   */
  hideLegend?: boolean;
  /**
   * Toggles error propagation to child-elements
   * @default true
   */
  errorPropagation?: boolean;
  nativeReadOnly?: boolean;
}

export const Fieldset = ({
  children,
  className,
  errorPropagation = true,
  legend,
  description,
  hideLegend,
  error,
  ...rest
}: FieldsetProps) => {
  const legendId = useId();
  const {
    inputProps,
    errorId,
    showErrorMsg,
    hasError,
    size,
    readOnly,
    inputDescriptionId,
  } = useFieldset({ description, error, ...rest }, legendId);

  const fieldset = useContext(FieldsetContext);

  return (
    <FieldsetContext.Provider
      value={{
        error: errorPropagation ? (error ?? fieldset?.error) : undefined,
        errorId: cl({
          [errorId]: showErrorMsg,
          [fieldset?.errorId ?? ""]: !!fieldset?.error,
        }),
        size,
        disabled: rest.disabled ?? false,
        readOnly,
      }}
    >
      <fieldset
        {...omit(rest, ["errorId", "size", "readOnly"])}
        {...inputProps}
        // ref={ref}
        className={cl(className, "aksel-fieldset", `aksel-fieldset--${size}`, {
          "aksel-fieldset--error": hasError,
          "aksel-fieldset--readonly": readOnly,
        })}
      >
        <label
          id={legendId}
          className={cl("aksel-fieldset__legend", {
            "aksel-sr-only": !!hideLegend,
          })}
        >
          {legend}
        </label>
        {!!description && (
          <div
            className={cl("aksel-fieldset__description", {
              "aksel-sr-only": !!hideLegend,
            })}
            id={inputDescriptionId}
          >
            {description}
          </div>
        )}
        {children}
        <div
          id={errorId}
          aria-relevant="additions removals"
          aria-live="polite"
          className="aksel-fieldset__error"
        >
          {showErrorMsg && <p>{error}</p>}
        </div>
      </fieldset>
    </FieldsetContext.Provider>
  );
};

export default Fieldset;
