import { DateRange } from "../DatePicker.types";
import DateRangeProvider from "../DatePicker.context";
import DatePickerCalendarGrid from "./CalendarGrid";
import DatePickerCalendarNav from "./Navigation";
import DatePickerTimeInputs from "./TimeInputs";

export interface DateRangePickerProps {
  onChange?: (range: DateRange) => void;
  /**
   * Changes the names of the weekdays
   * @default "en-US"
   */
  local: string;
}

const DateRangePicker = ({ onChange, local }: DateRangePickerProps) => {
  return (
    <DateRangeProvider onChange={onChange} local={local}>
      <DatePickerCalendarNav />
      <DatePickerCalendarGrid />
      <DatePickerTimeInputs />
    </DateRangeProvider>
  );
};

export default DateRangePicker;
