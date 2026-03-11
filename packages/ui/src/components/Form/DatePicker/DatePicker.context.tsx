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

const DateRangeProvider = ({ onChange, children }: DateRangeProviderProps) => {
  const [value, setValue] = useState<DateRangeContextState>(DEFAULT_VALUES);

  function selectDate(date: Date) {
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
  }

  const setStartTime = useCallback(
    (time: string) => {
      setValue(v => ({ ...v, startTime: time }));
      onChange?.({
        start: value.range?.start ?? new Date(),
        end: value.range?.end ?? new Date(),
        startTime: time,
        endTime: value.endTime,
      });
    },
    [setValue]
  );

  const setEndTime = useCallback(
    (time: string) => {
      setValue(v => ({ ...v, endTime: time }));
      onChange?.({
        start: value.range?.start ?? new Date(),
        end: value.range?.end ?? new Date(),
        startTime: value.startTime,
        endTime: time,
      });
    },
    [setValue]
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
      }}
    >
      {children}
    </DateRangeCtx.Provider>
  );
};
export default DateRangeProvider;
