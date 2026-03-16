import { useDateRange } from "../DatePicker.context";
import styles from "../DatePicker.module.css";

const DatePickerDayButton = ({ date }: { date: Date }) => {
  const { startDate, endDate, selectDate, today } = useDateRange();

  const ts = date.getTime();
  const isStart = !!startDate && startDate.getTime() === ts;
  const isEnd = !!endDate && endDate.getTime() === ts;

  const inRange =
    !!startDate &&
    !!endDate &&
    ts > Math.min(startDate.getTime(), endDate.getTime()) &&
    ts < Math.max(startDate.getTime(), endDate.getTime());
  const isToday = date.toDateString() === today.toDateString();

  return (
    <button
      tabIndex={1}
      data-today={isToday}
      data-start={isStart}
      data-end={isEnd}
      data-range={inRange}
      onClick={() => selectDate(date)}
      className={styles.dateButton}
      type="button"
    >
      {date.getDate()}
    </button>
  );
};

export default DatePickerDayButton;
