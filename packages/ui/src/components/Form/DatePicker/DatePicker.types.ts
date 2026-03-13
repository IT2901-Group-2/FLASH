export interface DateRange {
  startDate: Date | null;
  startTime: string;
  endDate: Date | null;
  endTime: string;
}

export const DEFAULT_DATE_RANGE: DateRange = {
  startDate: new Date(),
  startTime: "00:00",
  endDate: new Date(),
  endTime: "23:59",
};
