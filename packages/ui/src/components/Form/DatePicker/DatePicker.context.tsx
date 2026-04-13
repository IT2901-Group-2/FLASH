import { DateRange, DEFAULT_DATE_RANGE } from "./DatePicker.types";
import {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

interface DateRangeContextState extends DateRange {
  viewMonth: number;
  viewYear: number;
  selecting: "start" | "end";
  today: Date;
}

export interface DateRangeProviderHandle {
  resetSelection: () => void;
}

interface DateRangeContextValue extends DateRangeContextState, DateRangeProviderHandle {
  selectDate: (d: Date) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  onChange?: (range: DateRange) => void;
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
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  local: string;
  children: React.ReactNode;
  ref: React.Ref<DateRangeProviderHandle>;
}

const DEFAULT_VALUES = {
  get state(): DateRangeContextState {
    const today = new Date();
    return {
      ...DEFAULT_DATE_RANGE,
      viewMonth: today.getMonth(),
      viewYear: today.getFullYear(),
      selecting: "start",
      today,
    };
  },
};

const DateRangeProvider = ({
  onChange,
  local,
  children,
  ref,
  defaultValue,
}: DateRangeProviderProps) => {
  const [value, setValue] = useState<DateRangeContextState>({
    ...DEFAULT_VALUES.state,
    ...defaultValue,
  });

  useEffect(() => {
    setValue(v => ({ ...v, ...defaultValue }));
  }, [defaultValue]);

  const selectDate = (date: Date) => {
    if (value.selecting === "start")
      return setValue(v => ({
        ...v,
        startDate: date,
        endDate: null,
        selecting: "end",
      }));

    const [start, end] =
      date < value.startDate! ? [date, value.startDate] : [value.startDate, date];
    setValue(v => ({
      ...v,
      startDate: start,
      endDate: end,
      selecting: "start",
    }));
    onChange?.({
      startDate: start,
      endDate: end,
    });
  };

  const adjustViewMonth = (delta: number) => {
    setValue(v => {
      const d = new Date(v.viewYear, v.viewMonth + delta, 1);
      return { ...v, viewMonth: d.getMonth(), viewYear: d.getFullYear() };
    });
  };

  const prevMonth = () => adjustViewMonth(-1);
  const nextMonth = () => adjustViewMonth(1);

  const resetSelection = () => setValue(DEFAULT_VALUES.state);

  useImperativeHandle(ref, () => ({ resetSelection }));

  return (
    <DateRangeCtx.Provider
      value={{
        ...value,
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
