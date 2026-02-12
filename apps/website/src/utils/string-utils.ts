/**
 * Capitalzes the first letter in the given string.
 *
 * @param string The string to be capitalized
 * @returns The same string, but with its first letter capitalized
 */
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
