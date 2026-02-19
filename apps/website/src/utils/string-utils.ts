const alphabet = new TextEncoder().encode(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
);

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
  if (length < 0) return "";
  return new TextDecoder().decode(
    crypto
      .getRandomValues(new Uint8Array(length))
      .map(b => alphabet[b % alphabet.length]!)
  );
}
