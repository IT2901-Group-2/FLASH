import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDateRange } from "../DatePicker.context";
import styles from "../DatePicker.module.css";

const DatePickerCalendarNav = () => {
  const { viewMonth, viewYear, prevMonth, nextMonth, local } = useDateRange();
  const monthName = new Date(viewYear, viewMonth).toLocaleString(local, {
    month: "long",
  });

  return (
    <div className={styles.monthNav}>
      <button
        className={styles.navButton}
        onClick={prevMonth}
        type="button"
        tabIndex={1}
        aria-label="previous-month"
      >
        <ChevronLeft />
      </button>
      <span className={styles.monthTitle}>
        {monthName} {viewYear}
      </span>
      <button
        className={styles.navButton}
        onClick={nextMonth}
        type="button"
        tabIndex={1}
        aria-label="next-month"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default DatePickerCalendarNav;
