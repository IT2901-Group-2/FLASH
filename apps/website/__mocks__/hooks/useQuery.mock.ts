import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { vi } from "vitest";

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

/**
 * Creates a generic mock loading `UseQueryResult`, suitable for use in tests.
 */
export function mockQueryLoading<T>(): UseQueryResult<T> {
  return mockQueryResult({ isLoading: true });
}

/**
 * Creates a generic mock failed `UseQueryResult`, suitable for use in tests.
 */
export function mockQueryError<T>(error?: Error): UseQueryResult<T> {
  return mockQueryResult({ isError: true, error });
}

/**
 * Creates an `InfiniteData` object with the given pages. `pageParams` are set to the page indices by default.
 */
export function mockInfiniteData<T>(...pages: T[]): InfiniteData<T> {
  return {
    pages,
    pageParams: pages.map((_, i) => i),
  };
}

/**
 * Creates a generic mock `UseInfiniteQueryResult`, suitable for use in tests.
 * Automatically sets `data` and `error` to `undefined`/`null` based on the provided state flags.
 *
 * @example
 * mockInfiniteQueryResult([makeEvent(), makeEvent()]); // { data: [<event1>, <event2>], isLoading: false, isError: false, error: null }
 * mockInfiniteQueryResult([], { isLoading: true }); // { data: undefined, isLoading: true, isError: false, error: null }
 * mockInfiniteQueryResult([], { isError: true }); // { data: undefined, isLoading: false, isError: true, error: Error("Failed to load events") }
 * mockInfiniteQueryResult([], { isError: true, error: new Error("custom") }); // { data: undefined, isLoading: false, isError: true, error: Error("custom") }
 */
export function mockInfiniteQueryResult<T>({
  data,
  isLoading = false,
  isError = false,
  error = new Error("Failed to load events"),
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage = vi.fn(),
}: Partial<UseInfiniteQueryResult<InfiniteData<T>>>): UseInfiniteQueryResult<
  InfiniteData<T>
> {
  return {
    data: isLoading || isError ? undefined : data,
    error: isLoading || !isError ? null : error,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } as UseInfiniteQueryResult<InfiniteData<T>>;
}

/**
 * Creates a generic mock loading `UseInfiniteQueryResult`, suitable for use in tests.
 */
export function mockInfiniteQueryLoading<T>(): UseInfiniteQueryResult<InfiniteData<T>> {
  return mockInfiniteQueryResult({ isLoading: true });
}

/**
 * Creates a generic mock failed `UseInfiniteQueryResult`, suitable for use in tests.
 */
export function mockInfiniteQueryError<T>(
  error?: Error
): UseInfiniteQueryResult<InfiniteData<T>> {
  return mockInfiniteQueryResult({ isError: true, error });
}
