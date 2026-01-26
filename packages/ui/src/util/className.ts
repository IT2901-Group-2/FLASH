type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

/**
 * Converts a value of type `ClassValue` into a space-separated string of class names.
 *
 * - If the input is `null`, `undefined`, or a boolean, returns an empty string.
 * - If the input is a string or number, returns its string representation.
 * - If the input is an array, recursively processes each element and joins the results with spaces.
 * - If the input is an object, includes the keys whose values are truthy, joined by spaces.
 *
 * @param mix - The value to convert to a class name string. Can be a string, number, array, or object.
 * @returns A space-separated string of class names.
 */
function toVal(mix: Exclude<ClassValue, null | undefined | false>) {
  var k,
    y,
    str = "";

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      var len = mix.length;
      for (k = 0; k < len; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += " ");
            str += y;
          }
        }
      }
    } else {
      for (y in mix) {
        if (mix[y]) {
          str && (str += " ");
          str += y;
        }
      }
    }
  }

  return str;
}

/**
 * Combines multiple class name values into a single space-separated string.
 *
 * Each input is processed by the `toVal` function, filtered to remove falsy values,
 * and then joined with spaces. Useful for conditionally joining CSS class names.
 *
 * @param inputs - An array of class name values to be combined.
 * @returns A single string containing all valid class names separated by spaces.
 */
export function cl(...inputs: ClassValue[]) {
  var i = 0,
    tmp,
    x,
    str = "",
    len = inputs.length;
  for (; i < len; i++) {
    if ((tmp = inputs[i])) {
      if ((x = toVal(tmp))) {
        str && (str += " ");
        str += x;
      }
    }
  }
  return str;
}
