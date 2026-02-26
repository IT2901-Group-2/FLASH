/**
 * Returns the value attached to the `global` object if already initialized,
 * otherwise initializes the global value using the give initializer.
 *
 * This is a hack to prevent NextJS from creating multiple instances of global variables.
 * See: https://github.com/vercel/next.js/discussions/15054
 *
 * @param name A unique name to store the value under.
 * @param initializer The function to initialize the variable with.
 * @returns The global value if defined, otherwise the provided value.
 */
export function makeGlobal<T>(name: string, initializer: () => T): T {
  const symbol = Symbol.for(name);
  const _global = global as typeof global & { [symbol]?: T };

  _global[symbol] ??= initializer();
  return _global[symbol];
}
