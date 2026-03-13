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
import DateRangePicker from "./parts/DateRangePicker";
import { DateRange, DEFAULT_DATE_RANGE } from "./DatePicker.types";

export interface DatePickerProps
  extends FormFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
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
      <div>
        <input
          onClick={e => handleOpen(e)}
          value={`${value?.startDate?.toLocaleDateString()} ${value?.startTime}`}
          type="text"
          readOnly
        />
        <input
          onClick={e => handleOpen(e)}
          value={`${value?.endDate?.toLocaleDateString()} ${value?.endTime}`}
          type="text"
          readOnly
        />
      </div>
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
