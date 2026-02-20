/**
 * Recursively merges own and inherited enumerable properties of source objects
 * into the destination object, skipping source properties that resolve to
 * undefined. Array and plain object properties are merged recursively. Other
 * objects and value types are overridden by assignment. Source objects are
 * applied from left to right. Subsequent sources overwrite property
 * assignments of previous sources.
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
