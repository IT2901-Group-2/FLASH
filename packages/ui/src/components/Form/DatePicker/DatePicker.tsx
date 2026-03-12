import { InputHTMLAttributes, useEffect, useId, useRef, useState } from "react";
import { FormFieldProps } from "../useFormField";
import styles from "./DatePicker.module.css";
import { TextField } from "../TextField";
import { omit } from "@/util/helpers";
import DateRangePicker from "./parts/DateRangePicker";
import { DateRange } from "./DatePicker.types";

export interface DatePickerProps
  extends FormFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  description?: string;
  /**
   * Changes the names of the weekdays
   * @default "en-US"
   */
  local?: string;
  onRangeChange?: (values: { startDate: string; endDate: string }) => void;
}

const DatePicker = ({
  "data-color": color,
  local = "en-US",
  onRangeChange,
  ...rest
}: DatePickerProps) => {
  const [value, setValue] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = `calendar-${useId()}`;

  // For making "reset" inside a form work
  useEffect(() => {
    const form = buttonRef.current?.closest("form");
    if (!form) return;

    const handleReset = () => setValue("");
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, []);

  const handleChange = (range: DateRange) => {
    const startDate = `${range.start?.toLocaleDateString()} ${range.startTime}`;
    const endDate = `${range.end?.toLocaleDateString()} ${range.endTime}`;
    const formatted = `${startDate} - ${endDate}`.replace("T", " ");

    setValue(formatted);
    onRangeChange?.({ startDate, endDate });

    rest.onChange?.({
      target: { value: formatted, name: rest.name },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      <TextField
        {...omit({ ...rest }, ["defaultValue", "type"])}
        value={value}
        onClick={e => {
          e.currentTarget.blur();
          buttonRef.current?.click();
        }}
        onChange={() => {}} // To stop error in console
      />
      <button
        ref={buttonRef}
        popoverTarget={popoverId}
        className={styles.openCalendar}
        type="button"
      />
      <div data-color={color} popover="auto" id={popoverId} className={styles.calendar}>
        <DateRangePicker onChange={handleChange} local={local} />
      </div>
    </>
  );
};
export default DatePicker;
