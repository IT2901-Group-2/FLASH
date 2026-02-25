/**
 * Attaches the given value to the `global` object.
 * This is a hack to prevent NextJS from creating multiple instances of global variables.
 * See: https://github.com/vercel/next.js/discussions/15054
 *
 * @param name A unique name to store the value under.
 * @param value The value to initialize the variable with.
 * @returns The global value if defined, otherwise the provided value.
 */
export function makeGlobal<T>(name: string, value: T): T {
  const symbol = Symbol.for(name);
  const _global = global as typeof global & { [symbol]: T };

  _global[symbol] ??= value;
  return _global[symbol];
}
