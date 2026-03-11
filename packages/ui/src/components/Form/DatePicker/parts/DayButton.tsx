import { useDateRange } from "../DatePicker.context";
import styles from "../DatePicker.module.css";

const DatePickerDayButton = ({ date }: { date: Date }) => {
  const { range, selectDate, today } = useDateRange();
  const { start, end } = range;

  const ts = date.getTime();
  const isStart = !!start && start.getTime() === ts;
  const isEnd = !!end && end.getTime() === ts;

  const inRange =
    !!start &&
    !!end &&
    ts > Math.min(start.getTime(), end.getTime()) &&
    ts < Math.max(start.getTime(), end.getTime());
  const isToday = date.toDateString() === today.toDateString();

  return (
    <button
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
