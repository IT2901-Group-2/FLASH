import { useState } from "react";
import { TextField } from "../../TextField";
import { useDateRange } from "../DatePicker.context";
import styles from "../DatePicker.module.css";
import { SegmentedControl } from "@/components/SegmentedControl";

const DatePickerTimeInputs = () => {
  const { startTime, endTime, setStartTime, setEndTime } = useDateRange();
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleChange = (value: string) => {
    setDisabled(value === "full");
    setStartTime("00:00");
    setEndTime("23:59");
  };

  return (
    <>
      <SegmentedControl defaultValue="specific" size="small" onChange={handleChange}>
        <SegmentedControl.Item value="specific" label="Specific" />
        <SegmentedControl.Item value="full" label="Full" />
      </SegmentedControl>
      <div className={styles.timeContainer}>
        <TextField
          type="time"
          size="small"
          label="Start Time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          disabled={disabled}
        />
        <TextField
          type="time"
          size="small"
          label="End Time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default DatePickerTimeInputs;
