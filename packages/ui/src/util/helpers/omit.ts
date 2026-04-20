/**
 * Omit properties from an object.
 *
 * @param obj The source object from which properties will be omitted.
 * @param props An array of property keys to omit from the source object.
 * @returns A new object that contains all properties from the source object except those specified in the `props` array.
 *
 * @example
 * const original = { a: 1, b: 2, c: 3 };
 * const result = omit(original, ['b']);
 * console.log(result); // Output: { a: 1, c: 3 }
 */
function omit<T extends object, K extends keyof T>(obj: T, props: K[]): Omit<T, K> {
  const filteredEntries = Object.entries(obj).filter(
    ([key]) => !props.includes(key as K)
  );

  return Object.fromEntries(filteredEntries) as Omit<T, K>;
}

export { omit };
