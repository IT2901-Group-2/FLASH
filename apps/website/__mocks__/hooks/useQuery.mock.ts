import { UseQueryResult } from "@tanstack/react-query";

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
