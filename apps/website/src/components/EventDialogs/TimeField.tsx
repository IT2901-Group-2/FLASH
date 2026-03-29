import { DropdownControl, TextField } from "@flash/ui";
import { EventTime, TIME_PRESETS, TimePreset } from "./types";

interface EventTimeFieldProps {
  value: EventTime;
  onChange: (v: EventTime) => void;
  error?: string;
}

const isFullDay = (v: EventTime) =>
  v.startTime === TIME_PRESETS.full.startTime && v.endTime === TIME_PRESETS.full.endTime;

function EventTimeField({ value, onChange, error }: EventTimeFieldProps) {
  const preset = isFullDay(value) ? "full" : "specific";

  const handlePresetChange = (selected: string) =>
    onChange(TIME_PRESETS[selected as TimePreset]);

  const handleTimeChange = (key: keyof EventTime, time: string) =>
    onChange({ ...value, [key]: time });

  return (
    <DropdownControl
      label="Event Time"
      error={error}
      dropdownBorder
      value={preset}
      onChange={handlePresetChange}
    >
      <DropdownControl.Item value="full" label="Full Day" />
      <DropdownControl.Item
        value="specific"
        label="Specific Time"
        content={
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <TextField
              type="time"
              size="small"
              label="Start Time"
              value={value.startTime}
              onChange={e => handleTimeChange("startTime", e.target.value)}
            />
            <TextField
              type="time"
              size="small"
              label="End Time"
              value={value.endTime}
              onChange={e => handleTimeChange("endTime", e.target.value)}
            />
          </div>
        }
      />
    </DropdownControl>
  );
}
export default EventTimeField;
