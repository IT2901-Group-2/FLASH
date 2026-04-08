import { DropdownControl, TextField } from "@flash/ui";
import { EventTime, TimePreset, TIME_PRESETS } from "./defaults";
import { useTranslations } from "next-intl";

interface EventTimeFieldProps {
  value: EventTime;
  onChange: (v: EventTime) => void;
  error?: string;
}

const isFullDay = (v: EventTime) =>
  v.startTime === TIME_PRESETS.full.startTime && v.endTime === TIME_PRESETS.full.endTime;

function EventTimeField({ value, onChange, error }: EventTimeFieldProps) {
  const t = useTranslations("admin.dashboard.event.basics.field.timeRange");

  const preset = isFullDay(value) ? "full" : "specific";

  const handlePresetChange = (selected: string) =>
    onChange(TIME_PRESETS[selected as TimePreset]);

  const handleTimeChange = (key: keyof EventTime, time: string) =>
    onChange({ ...value, [key]: time });

  return (
    <DropdownControl
      label={t("title")}
      description={t("description")}
      error={error}
      dropdownBorder
      value={preset}
      onChange={handlePresetChange}
    >
      <DropdownControl.Item value="full" label={t("value.full")} />
      <DropdownControl.Item
        value="specific"
        label={t("value.specific")}
        content={
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <TextField
              type="time"
              size="small"
              label={t("value.startTime")}
              value={value.startTime}
              onChange={e => handleTimeChange("startTime", e.target.value)}
            />
            <TextField
              type="time"
              size="small"
              label={t("value.endTime")}
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
