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

export const createDate = ({
  date,
  hours = 0,
  minutes = 0,
}: { date?: Date; hours?: number; minutes?: number } = {}): Date => {
  const base = date ? new Date(date) : new Date();
  base.setHours(hours, minutes, 0, 0);
  return base;
};

export const parseTimeOrDate = (input: DateWithTimeInput): Date => {
  if (typeof input === "string") {
    const [h, m] = input.split(":").map(Number);
    return createDate({ hours: h, minutes: m });
  } else return createDate(input);
};
