import { UseQueryResult } from "@tanstack/react-query";

/**
 * Creates a generic mock `UseQueryResult`, suitable for use in tests.
 * Automatically sets `data` and `error` to `undefined`/`null` based on the provided state flags.
 *
 * @example
 * mockQueryResult([makeEvent(), makeEvent()]); // { data: [<event1>, <event2>], isLoading: false, isError: false, error: null }
 * mockQueryResult([], { isLoading: true }); // { data: undefined, isLoading: true, isError: false, error: null }
 * mockQueryResult([], { isError: true }); // { data: undefined, isLoading: false, isError: true, error: Error("Failed to load events") }
 * mockQueryResult([], { isError: true, error: new Error("custom") }); // { data: undefined, isLoading: false, isError: true, error: Error("custom") }
 * mockQueryResult([makeImage(), makeImage()]); // { data: [<Image1>, <Image2>], isLoading: false, isError: false, error: null }
 * mockQueryResult([], { isLoading: true }); // { data: undefined, isLoading: true, isError: false, error: null }
 * mockQueryResult([], { isError: true }); // { data: undefined, isLoading: false, isError: true, error: Error("Failed to load Images") }
 * mockQueryResult([], { isError: true, error: new Error("custom") }); // { data: undefined, isLoading: false, isError: true, error: Error("custom") }
 */
export function mockQueryResult<T>({
  data,
  isLoading = false,
  isError = false,
  error = new Error("Failed to load events"),
}: Partial<UseQueryResult<T>>): UseQueryResult<T> {
  return {
    data: isLoading || isError ? undefined : data,
    error: isLoading || !isError ? null : error,
    isLoading,
    isError,
  } as UseQueryResult<T>;
}
