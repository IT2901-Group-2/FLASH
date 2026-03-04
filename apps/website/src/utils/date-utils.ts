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

/**
 * Creates a typed date/time change handler for any form object.
 *
 * Only allows fields whose value type is Date.
 *
 * @template TForm - The form data type
 * @template TKey - A key of TForm whose value is Date
 *
 * @param field - The field name to update
 * @param kind - Whether updating the "date" or "time" portion
 * @param formData - The full form data object
 * @param updateFormData - State updater function
 *
 * @returns React change handler for <input type="date" | "time">
 */
export function makeDateTimeHandler<TForm, TKey extends keyof TForm>(
  field: TKey & (TForm[TKey] extends Date ? TKey : never),
  kind: "date" | "time",
  formData: TForm,
  updateFormData: (field: TKey, value: Date) => void
): React.ChangeEventHandler<HTMLInputElement> {
  return e => {
    const value = e.target.value;
    const currentValue = formData[field];
    const base = currentValue instanceof Date ? new Date(currentValue) : new Date();
    const next = new Date(base);

    if (kind === "date") {
      const [year, month, day] = value.split("-").map(Number);

      next.setFullYear(
        year ?? new Date(Date.now()).getFullYear(),
        (month ?? 1) - 1,
        day ?? 1
      );
    } else {
      const [hours, minutes, seconds] = value.split(":").map(Number);

      next.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0, 0);
    }

    updateFormData(field, next);
  };
}
