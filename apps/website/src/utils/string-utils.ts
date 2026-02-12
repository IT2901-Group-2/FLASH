/**
 * Capitalzes the first letter in the given string.
 *
 * @param string The string to be capitalized
 * @returns The same string, but with its first letter capitalized
 */
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Generates a random string of a given length
 * Uses only alphabetical charachters (a-zA-Z).
 *
 * @param length The length the outputed string will be
 * @returns A random string of the specified length
 */
export function generateRandomString(length: number): string {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
