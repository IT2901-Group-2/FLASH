import {
  InputHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { FormFieldProps } from "../useFormField";
import styles from "./DatePicker.module.css";
import { DateRange, DEFAULT_DATE_RANGE } from "./DatePicker.types";
import { TextField } from "../TextField";
import { omit } from "@/util/helpers";
import { DropdownControl } from "@/components/DropdownControl";
import DateRangeProvider from "./DatePicker.context";
import DatePickerCalendarNav from "./parts/Navigation";
import DatePickerCalendarGrid from "./parts/CalendarGrid";

export interface DatePickerProps
  extends FormFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  dateLabel: string;
  timeLabel: string;
  description?: string;
  /**
   * Changes the names of the weekdays
   * @default "en-US"
   */
  local?: string;
  onRangeChange?: (values: { startDate: Date; endDate: Date }) => void;
}

const DatePicker = ({
  "data-color": color,
  local = "en-US",
  dateLabel,
  onRangeChange,
  ...rest
}: DatePickerProps) => {
  const [value, setValue] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = `calendar-${useId()}`;

  // For making "reset" inside a form work
  useEffect(() => {
    const form = buttonRef.current?.closest("form");
    if (!form) return;

    const handleReset = () =>
      setValue({
        startDate: new Date(),
        startTime: "00:00",
        endDate: new Date(),
        endTime: "00:00",
      });
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, []);

  const handleChange = (range: DateRange) => {
    const [startHours, startMinutes] = range.startTime.split(":").map(Number);
    const [endHours, endMinutes] = range.endTime.split(":").map(Number);

    const startDateTime = new Date(range.startDate!);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(range.endDate!);
    endDateTime.setHours(endHours, endMinutes);

    setValue(range);
    onRangeChange?.({ startDate: startDateTime, endDate: endDateTime });
  };

  const handleOpen = (e: MouseEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
    buttonRef.current?.click();
  };

  return (
    <>
      <TextField
        {...omit({ ...rest }, ["defaultValue", "type"])}
        label={dateLabel}
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
      <DateRangeProvider onChange={handleChange} local={local}>
        <div data-color={color} popover="auto" id={popoverId} className={styles.calendar}>
          <DatePickerCalendarNav />
          <DatePickerCalendarGrid />
        </div>
        <DropdownControl defaultValue="full" dropdownBorder label="TEST">
          <DropdownControl.Item value="full" label="Full Day" />
          <DropdownControl.Item
            value="specific"
            label="Specific Time"
            content={
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <TextField label="Start Time" type="time" size="small" />
                <TextField label="End Time" type="time" size="small" />
              </div>
            }
          />
        </DropdownControl>
      </DateRangeProvider>
    </>
  );
};
export default DatePicker;
