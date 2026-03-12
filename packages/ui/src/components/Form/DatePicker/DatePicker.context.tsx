import { DateRange } from "./DatePicker.types";
import { createContext, useCallback, useContext, useState } from "react";

interface DateRangeContextState {
  viewMonth: number;
  viewYear: number;
  selecting: "start" | "end";
  range: Pick<DateRange, "start" | "end">;
  startTime: string;
  endTime: string;
  today: Date;
}

interface DateRangeContextValue extends DateRangeContextState {
  setStartTime: (t: string) => void;
  setEndTime: (t: string) => void;
  selectDate: (d: Date) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  onChange?: (range: DateRange) => void;
  resetSelection: () => void;
  local: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const DateRangeCtx = createContext<DateRangeContextValue | null>(null);
export const useDateRange = () => {
  const ctx = useContext(DateRangeCtx);
  if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────
interface DateRangeProviderProps {
  onChange?: (range: DateRange) => void;
  local: string;
  children: React.ReactNode;
}

const today = new Date();

const DEFAULT_VALUES: DateRangeContextState = {
  viewMonth: today.getMonth(),
  viewYear: today.getFullYear(),
  selecting: "start",
  range: { start: null, end: null },
  startTime: "00:00",
  endTime: "23:59",
  today: new Date(),
};

const DateRangeProvider = ({ onChange, local, children }: DateRangeProviderProps) => {
  const [value, setValue] = useState<DateRangeContextState>(DEFAULT_VALUES);

  const selectDate = (date: Date) => {
    if (value.selecting === "start") {
      setValue(v => {
        return { ...v, range: { start: date, end: null }, selecting: "end" };
      });
    } else {
      const [start, end] =
        date < value.range.start! ? [date, value.range.start] : [value.range.start, date];
      const next = { start: start, end: end };
      setValue(v => {
        return { ...v, range: next, selecting: "start" };
      });
      onChange?.({ ...next, startTime: value.startTime, endTime: value.endTime });
    }
  };

  const setStartTime = useCallback(
    (time: string) => {
      setValue(v => {
        onChange?.({
          start: v.range?.start ?? new Date(),
          end: v.range?.end ?? new Date(),
          startTime: time,
          endTime: v.endTime,
        });
        return { ...v, startTime: time };
      });
    },
    [onChange]
  );

  const setEndTime = useCallback(
    (time: string) => {
      setValue(v => {
        onChange?.({
          start: v.range?.start ?? new Date(),
          end: v.range?.end ?? new Date(),
          startTime: v.startTime,
          endTime: time,
        });
        return { ...v, endTime: time };
      });
    },
    [onChange]
  );

  const adjustViewMonth = (delta: number) => {
    setValue(v => {
      const d = new Date(v.viewYear, v.viewMonth + delta, 1);
      return { ...v, viewMonth: d.getMonth(), viewYear: d.getFullYear() };
    });
  };

  const prevMonth = () => adjustViewMonth(-1);
  const nextMonth = () => adjustViewMonth(1);

  const resetSelection = () => setValue(DEFAULT_VALUES);

  return (
    <DateRangeCtx.Provider
      value={{
        ...value,
        setStartTime,
        setEndTime,
        selectDate,
        prevMonth,
        nextMonth,
        onChange,
        resetSelection,
        local,
      }}
    >
      {children}
    </DateRangeCtx.Provider>
  );
};
export default DateRangeProvider;
