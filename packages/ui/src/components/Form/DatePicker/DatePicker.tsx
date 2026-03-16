import { InputHTMLAttributes, useEffect, useId, useRef, useState } from "react";
import { FormFieldProps } from "../useFormField";
import styles from "./DatePicker.module.css";
import { DateRange, DEFAULT_DATE_RANGE } from "./DatePicker.types";
import { TextField } from "../TextField";
import { omit } from "@/util/helpers";
import DateRangeProvider, { DateRangeProviderHandle } from "./DatePicker.context";
import DatePickerCalendarNav from "./parts/Navigation";
import DatePickerCalendarGrid from "./parts/CalendarGrid";

export interface DatePickerProps
  extends
    FormFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange"> {
  label: string;
  value?: DateRange;
  /**
   * Changes the names of the weekdays
   * @default "en-US"
   */
  local?: string;
  onChange?: (value: DateRange) => void;
}

const DatePicker = ({
  "data-color": color,
  local = "en-US",
  label,
  value: _value,
  onChange,
  ...rest
}: DatePickerProps) => {
  const [value, setValue] = useState<DateRange>(_value ?? DEFAULT_DATE_RANGE);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const providerRef = useRef<DateRangeProviderHandle>(null);
  const popoverId = `calendar-${useId()}`;

  // For making "reset" inside a form work
  useEffect(() => {
    const next = _value ?? DEFAULT_DATE_RANGE;
    setValue(next);
    // Only reset the calendar state if value is clearing back to default
    if (!next.startDate && !next.endDate) providerRef.current?.resetSelection();
  }, [_value]);

  const handleChange = (newValue: DateRange) => {
    setValue(newValue);
    onChange?.(newValue); // forward to RHF
  };

  return (
    <div>
      <button
        ref={buttonRef}
        popoverTarget={popoverId}
        className={styles.openCalendar}
        type="button"
        tabIndex={-1}
      />
      <TextField
        {...omit({ ...rest }, ["defaultValue", "type"])}
        label={label}
        value={[
          value.startDate?.toLocaleDateString(local),
          value.endDate?.toLocaleDateString(local),
        ]
          .filter(Boolean)
          .join(" - ")}
        onClick={e => {
          e.currentTarget.blur();
          buttonRef.current?.click();
        }}
        onFocus={e => e.currentTarget.click()}
        onChange={() => {}} // To stop error in console
      />
      <DateRangeProvider ref={providerRef} onChange={handleChange} local={local}>
        <div data-color={color} popover="auto" id={popoverId} className={styles.calendar}>
          <DatePickerCalendarNav />
          <DatePickerCalendarGrid />
        </div>
      </DateRangeProvider>
    </div>
  );
};
export default DatePicker;
