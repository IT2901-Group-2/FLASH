export const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

export interface DateRange {
  start: Date | null;
  end: Date | null;
  startTime: string;
  endTime: string;
}

export interface DateRangeValue {
  start: Date;
  end: Date;
}
