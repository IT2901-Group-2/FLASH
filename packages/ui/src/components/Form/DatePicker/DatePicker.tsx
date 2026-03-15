import { InputHTMLAttributes, useEffect, useId, useRef, useState } from "react";
import { FormFieldProps } from "../useFormField";
import styles from "./DatePicker.module.css";
import { DateRange, DEFAULT_DATE_RANGE } from "./DatePicker.types";
import { TextField } from "../TextField";
import { omit } from "@/util/helpers";
import DateRangeProvider from "./DatePicker.context";
import DatePickerCalendarNav from "./parts/Navigation";
import DatePickerCalendarGrid from "./parts/CalendarGrid";

export interface DatePickerProps
  extends FormFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value"> {
  label: string;
  value?: DateRange;
  /**
   * Changes the names of the weekdays
   * @default "en-US"
   */
  local?: string;
}

const DatePicker = ({
  "data-color": color,
  local = "en-US",
  label,
  value: _value,
  ...rest
}: DatePickerProps) => {
  const [value, setValue] = useState<DateRange>(_value ?? DEFAULT_DATE_RANGE);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = `calendar-${useId()}`;

  // For making "reset" inside a form work
  useEffect(() => {
    const form = buttonRef.current?.closest("form");
    if (!form) return;

    const handleReset = () => setValue(DEFAULT_DATE_RANGE);
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, []);

  return (
    <>
      <TextField
        {...omit({ ...rest }, ["defaultValue", "type"])}
        label={label}
        value={`${value.startDate?.toLocaleDateString()} - ${value.endDate?.toLocaleDateString()}`}
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
      <DateRangeProvider onChange={setValue} local={local}>
        <div data-color={color} popover="auto" id={popoverId} className={styles.calendar}>
          <DatePickerCalendarNav />
          <DatePickerCalendarGrid />
        </div>
      </DateRangeProvider>
    </>
  );
};
export default DatePicker;
