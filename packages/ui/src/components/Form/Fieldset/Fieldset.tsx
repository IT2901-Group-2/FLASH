import React, { FieldsetHTMLAttributes, useContext, useId } from "react";
import { cl, omit } from "@/util/helpers";
import { FormFieldProps } from "../useFormField";
import { FieldsetContext } from "./Fieldset.context";
import { useFieldset } from "./useFieldset";
import styles from "./Fieldset.module.css";

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
        data-size={size}
        data-error={hasError}
        data-readonly={readOnly}
        // ref={ref}
        className={cl(className, styles.fieldset)}
      >
        <legend id={legendId} hidden={hideLegend} className={styles.legend}>
          {legend}
        </legend>
        {!!description && (
          <div hidden={hideLegend} className={styles.description} id={inputDescriptionId}>
            {description}
          </div>
        )}
        {children}
        <div id={errorId} className={styles.error}>
          {showErrorMsg && <p>{error}</p>}
        </div>
      </fieldset>
    </FieldsetContext.Provider>
  );
};

export default Fieldset;
