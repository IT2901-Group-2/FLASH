/**
 * Utility function to statically assert the equality of two types.
 * This function should never be called.
 *
 * @example
 * ```typescript
 * assertEqual<{a: number}, {a: number}> // Will trigger a type error
 * assertEqual<{a: number}, {a: string}> // Will trigger a type error
 *
 * assertEqual<Record<string, number>, {[key: string]: number}> // Will pass
 * assertEqual<Record<string, number>, {[key: string]: number, a: boolean}> // Will trigger a type error
 * ```
 */
// @ts-expect-error
export function assertEqual<T, U extends T, R extends U = T>(): never {
  throw new Error("This function should never be called.");
}
