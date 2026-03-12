import { useFormContext, Controller } from "react-hook-form";
import DatePicker, { DatePickerProps } from "./DatePicker";

interface DatePickerFieldProps extends Omit<DatePickerProps, "onRangeChange"> {
  startName: string;
  endName: string;
  validate?: (startDate: string, endDate: string) => string | undefined;
}

const DatePickerField = ({
  startName,
  endName,
  required,
  validate,
  ...rest
}: DatePickerFieldProps) => {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={startName}
      rules={{
        required: required && "Start and end date is required",
        validate: startDate => {
          const endDate = getValues(endName);
          return validate?.(startDate, endDate);
        },
      }}
      render={() => (
        <DatePicker
          {...rest}
          required={required}
          error={
            errors[startName]?.message?.toString() ?? errors[endName]?.message?.toString()
          }
          onRangeChange={({ startDate, endDate }) => {
            setValue(startName, startDate, { shouldValidate: true });
            setValue(endName, endDate, { shouldValidate: true });
          }}
        />
      )}
    />
  );
};

export default DatePickerField;
