/**
 * The base font size. Usually set to 16px.
 */
const baseFontSize = 16;
/**
 * Converts a pixel value to rem units based on a base font size of 16px.
 *
 * @param size - The pixel value to convert.
 * @returns A string representing the equivalent rem value.
 */
export const pxToRem = (size: number) => `${size / baseFontSize}rem`;
