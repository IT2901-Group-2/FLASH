import {
  InputHTMLAttributes,
  ToggleEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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
  const providerRef = useRef<DateRangeProviderHandle>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
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

  const handleCalendarToggle = useCallback((e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState === "open")
      calendarRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, []);

  return (
    <div>
      <TextField
        {...omit({ ...rest }, ["defaultValue", "type"])}
        label={label}
        value={[
          value.startDate?.toLocaleDateString(local),
          value.endDate?.toLocaleDateString(local),
        ]
          .filter(Boolean)
          .join(" - ")}
        readOnly
        inputMode="none"
        onClick={e => {
          e.currentTarget.blur();
          calendarRef.current?.showPopover();
        }}
        onFocus={e => {
          e.currentTarget.blur();
          calendarRef.current?.showPopover();
        }}
        onChange={() => {}} // To stop error in console
        className={styles.inputField}
      />
      <DateRangeProvider ref={providerRef} onChange={handleChange} local={local}>
        <div
          ref={calendarRef}
          data-color={color}
          popover="auto"
          id={popoverId}
          className={styles.calendar}
          onToggle={handleCalendarToggle}
        >
          <DatePickerCalendarNav />
          <DatePickerCalendarGrid />
        </div>
      </DateRangeProvider>
    </div>
  );
};
export default DatePicker;
