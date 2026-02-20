/**
 * The base font size. Usually set to 16px.
 */
const BASE_FONT_SIZE = 16;
/**
 * Converts a pixel value to rem units based on a base font size of 16px.
 *
 * @param size - The pixel value to convert.
 * @returns A string representing the equivalent rem value.
 */
export const pxToRem = (size: number, baseFontSize: number = BASE_FONT_SIZE) => {
  if (baseFontSize <= 0) throw new EvalError("Base font size must be greater than zero.");
  if (!isFinite(size) || !isFinite(baseFontSize))
    throw new EvalError("Size and base font size must be finite numbers.");
  return `${size / baseFontSize}rem`;
};
