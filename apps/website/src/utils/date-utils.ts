/**
 * Pads a number with a leading zero if needed.
 *
 * @param n - The number to pad
 * @returns A 2-digit string
 */
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Formats a Date object into a string usable by <input type="date" />.
 * Uses local time.
 *
 * @param date - The Date object to format
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date) => {
  if (!date) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * Formats a Date object into a string usable by <input type="time" />.
 * Uses local time.
 *
 * @param date - The Date object to format
 * @returns Time string in HH:MM format
 */
export const formatTimeForInput = (date: Date) => {
  if (!date) return "";
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`; // include seconds if you need them
};

type DateWithTimeInput =
  | {
      /** Optional base date */
      date?: Date;
      /** Optional hours */
      hours?: number; //
      /** Optional minutes */
      minutes?: number;
    }
  /** Allow "HH:mm" string for convenience */
  | string;

/**
 * Creates a Date object from separate date and time components, or
 * from a "HH:mm" string.
 *
 * The resulting Date will have the specified hours and minutes, with
 * seconds andmilliseconds set to zero.
 *
 * @param options - An object containing either:
 *   - `date`: An optional Date object to use as the base (defaults to now).
 *   - `hours`: Optional hours to set (0-23, defaults to 0).
 *   - `minutes`: Optional minutes to set (0-59, defaults to 0).
 *
 * Or a string in "HH:mm" format, which will be parsed into hours and minutes.
 *
 * @returns A Date object with the specified date and time components.
 *
 * @example
 * createDate({ date: new Date("2026-01-01"), hours: 14, minutes: 30 });
 * // Returns a Date for Jan 1, 2026 at 14:30 local time.
 *
 * createDate("09:45");
 * // Returns a Date for today at 09:45 local time.
 */
export const createDate = ({
  date,
  hours = 0,
  minutes = 0,
}: { date?: Date; hours?: number; minutes?: number } = {}): Date => {
  const base = date ? new Date(date) : new Date();
  base.setHours(hours, minutes, 0, 0);
  return base;
};

/**
 * Parses a Date object from either a "HH:mm" string or an object with
 * date, hours, and minutes.
 *
 * @param input Either a string in "HH:mm" format or an object containing:
 *   - `date`: An optional Date object to use as the base (defaults to now).
 *   - `hours`: Optional hours to set (0-23, defaults to 0).
 *   - `minutes`: Optional minutes to set (0-59, defaults to 0).
 * @returns A Date object with the specified date and time components.
 *
 * @example
 * parseTimeOrDate("14:30");
 * // Returns a Date for today at 14:30 local time.
 *parseTimeOrDate({ date: new Date("2026-01-01"), hours: 14, minutes: 30 });
 * // Returns a Date for Jan 1, 2026 at 14:30 local time.
 */
export const parseTimeOrDate = (input: DateWithTimeInput): Date => {
  if (typeof input === "string") {
    const [h, m] = input.split(":").map(Number);
    return createDate({ hours: h, minutes: m });
  } else return createDate(input);
};
