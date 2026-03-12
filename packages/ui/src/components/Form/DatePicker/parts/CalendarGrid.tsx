import { ReactNode } from "react";
import { useDateRange } from "../DatePicker.context";
import DatePickerDayButton from "./DayButton";
import styles from "../DatePicker.module.css";
import { getWeekDays } from "@/util/helpers/getWeekDays";

const DatePickerCalendarGrid = () => {
  const { viewMonth, viewYear, local } = useDateRange();

  const firstDay = new Date(viewYear, viewMonth, 0).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`pad-${i}`} />);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(<DatePickerDayButton key={d} date={new Date(viewYear, viewMonth, d)} />);

  return (
    <div>
      <div className={styles.dateGrid}>
        {getWeekDays(local).map((d, key) => (
          <div key={key} className={styles.dateName}>
            {d.toUpperCase().slice(0, 3)}
          </div>
        ))}
      </div>
      <div className={styles.dateGrid}>{cells}</div>
    </div>
  );
};

export default DatePickerCalendarGrid;
