/**
 * Utility function to statically assert the equality of two types.
 * This function should never be called.
 *
 * @example
 * ```typescript
 * void assertEqual<{a: number}, {a: number}> // Will pass
 * void assertEqual<{a: number}, {a: string}> // Will trigger a type error
 *
 * void assertEqual<Record<string, number>, {[key: string]: number}> // Will pass
 * void assertEqual<Record<string, number>, {[key: string]: number, a: boolean}> // Will trigger a type error
 * ```
 */
// @ts-expect-error This is supposed to throw when the types don't match
export function assertEqual<T, U extends T, _ extends U = T>(): never {
  throw new Error("This function should never be called.");
}
