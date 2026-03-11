import { TextField } from "../../TextField";
import { useDateRange } from "../DatePicker.context";
import styles from "../DatePicker.module.css";

const DatePickerTimeInputs = () => {
  const { startTime, endTime, setStartTime, setEndTime } = useDateRange();

  return (
    <div className={styles.timeContainer}>
      <TextField
        type="time"
        size="small"
        label="Start Time"
        value={startTime}
        onChange={e => setStartTime(e.target.value)}
      />
      <TextField
        type="time"
        size="small"
        label="End Time"
        value={endTime}
        onChange={e => setEndTime(e.target.value)}
      />
    </div>
  );
};

export default DatePickerTimeInputs;
