/**
 * Returns the localized names of the weekdays for a given locale.
 *
 * The function generates weekday names starting from Monday and returns
 * them in order through Sunday using the locale's language rules.
 *
 * @param {string} locale - A valid BCP 47 locale string (e.g. "en-US", "nb-NO", "fr-FR")
 * used by `Intl.DateTimeFormat` / `toLocaleDateString` to format weekday names.
 *
 * @returns {string[]} An array containing the full weekday names starting from Monday.
 *
 * @example
 * const weekDays = getWeekDays("nb-NO");
 * // ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]
 *
 * @example
 * const weekDays = getWeekDays("en-US");
 * // ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
 */
export const getWeekDays = (locale: string) => {
  const baseDate = new Date(Date.UTC(2026, 2, 9)); // Random Monday
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { weekday: "long" }));
    baseDate.setDate(baseDate.getDate() + 1);
  }
  return weekDays;
};
