export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export const DEFAULT_DATE_RANGE: DateRange = {
  startDate: new Date(),
  endDate: new Date(),
};
