import { DateRange } from "../DatePicker.types";
import DateRangeProvider from "../DatePicker.context";
import DatePickerCalendarGrid from "./CalendarGrid";
import DatePickerCalendarNav from "./Navigation";
import DatePickerTimeInputs from "./TimeInputs";

export interface DateRangePickerProps {
  onChange?: (range: DateRange) => void;
}

const DateRangePicker = ({ onChange }: DateRangePickerProps) => {
  return (
    <DateRangeProvider onChange={onChange}>
      <DatePickerCalendarNav />
      <DatePickerCalendarGrid />
      <DatePickerTimeInputs />
    </DateRangeProvider>
  );
};

export default DateRangePicker;
