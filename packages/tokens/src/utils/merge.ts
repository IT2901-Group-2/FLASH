/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Merges the source objects into the destination object. The merge is
 * performed recursively, meaning that nested objects will also be merged.
 * Arrays are concatenated. Undefined values in the source objects are
 * ignored and do not overwrite existing values in the destination object.
 *
 * @param T — The type of the source objects.
 * @param object — The destination object.
 * @param source — The source objects.
 */
export const merge = <T extends Record<string, any>>(
  object: Record<string, any>,
  ...sources: Partial<T>[]
): Record<string, any> => {
  sources.forEach(source => {
    if (!source) return;
    Object.keys(source).forEach(key => {
      const sourceValue = source[key];
      const objectValue = object[key];
      if (sourceValue === undefined) return;

      if (Array.isArray(sourceValue) && Array.isArray(objectValue))
        object[key] = [...objectValue, ...sourceValue];
      else if (isPlainObject(sourceValue) && isPlainObject(objectValue))
        object[key] = merge({ ...objectValue }, sourceValue);
      else object[key] = sourceValue;
    });
  });
  return object;
};

function isPlainObject(value: Record<string, any>) {
  return (
    Object.prototype.toString.call(value) === "[object Object]" &&
    (Object.getPrototypeOf(value) === null ||
      Object.getPrototypeOf(value) === Object.prototype)
  );
}
