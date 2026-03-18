import { vi } from "vitest";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { CreateEvent, Event, UpdateEvent } from "@/db";
import { makeEvent } from "../factories/event.factory";

// ---------------------------------------------------------------------------
// Default return values
// ---------------------------------------------------------------------------

/**
 * Idle default for `useEventsQuery`. Used internally by `eventHooksMock()`.
 * In tests, prefer `mockEventsLoaded` / `mockEventsLoading` / `mockEventsError`.
 */
export const defaultEventsQueryReturn = {
  data: undefined as Event[] | undefined,
  isLoading: false,
  isError: false,
} as UseQueryResult<Event[]>;

/**
 * Idle default for `useEventCodeQuery`. Used internally by `eventHooksMock()`.
 * Override `data` when the component reads the join code (QR display, slideshow):
 * @example
 * vi.mocked(useEventCodeQuery).mockReturnValue({ ...defaultEventCodeQueryReturn, data: "ABC123" });
 */
export const defaultEventCodeQueryReturn = {
  data: undefined as string | undefined,
  isLoading: false,
  isError: false,
} as UseQueryResult<string>;

/**
 * Idle default for `useCreateEventMutation`. `mutateAsync` resolves with `makeEvent()`.
 * Spread and replace `mutateAsync` to assert on the submitted payload:
 * @example
 * const mockCreate = vi.fn().mockResolvedValue(makeEvent());
 * vi.mocked(useCreateEventMutation).mockReturnValue({ ...defaultCreateEventMutationReturn, mutateAsync: mockCreate });
 * expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ name: "Launch Party" }));
 */
export const defaultCreateEventMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(makeEvent()),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<Event, Error, CreateEvent>;

/**
 * Idle default for `useUpdateEventMutation`. `mutateAsync` resolves with `makeEvent()`.
 * Spread and replace `mutateAsync` to assert on patched fields:
 * @example
 * const mockUpdate = vi.fn().mockResolvedValue(makeEvent());
 * vi.mocked(useUpdateEventMutation).mockReturnValue({ ...defaultUpdateEventMutationReturn, mutateAsync: mockUpdate });
 * expect(mockUpdate).toHaveBeenCalledWith({ eventId: "event-1", data: expect.objectContaining({ uploadLimit: 12 }) });
 */
export const defaultUpdateEventMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(makeEvent()),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<Event, Error, { eventId: string; data: UpdateEvent }>;

/**
 * Idle default for `useDeleteEventMutation`. `mutateAsync` resolves with `undefined`.
 * Spread and replace `mutateAsync` to assert on the deleted ID:
 * @example
 * const mockDelete = vi.fn().mockResolvedValue(undefined);
 * vi.mocked(useDeleteEventMutation).mockReturnValue({ ...defaultDeleteEventMutationReturn, mutateAsync: mockDelete });
 * expect(mockDelete).toHaveBeenCalledWith({ eventId: "event-1" });
 */
export const defaultDeleteEventMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<void, Error, { eventId: string }>;

// ---------------------------------------------------------------------------
// State builders
// ---------------------------------------------------------------------------

/**
 * Successful `useEventsQuery` result with the given events.
 * @example
 * beforeEach(() => {
 *   vi.mocked(useEventsQuery)
 *      .mockReturnValue(
 *         mockEventsLoaded([makeEvent({ name: "Birthday Bash" })]
 *      )
 *    );
 * });
 */
export const mockEventsLoaded = (events: Event[]): UseQueryResult<Event[]> => {
  return { data: events, isLoading: false, isError: false } as UseQueryResult<Event[]>;
};

/**
 * Loading `useEventsQuery` result.
 *
 * `data` is undefined, `isLoading` is true.
 * @example
 * vi.mocked(useEventsQuery).mockReturnValue(mockEventsLoading());
 */
export const mockEventsLoading = (): UseQueryResult<Event[]> => {
  return { data: undefined, isLoading: true, isError: false } as UseQueryResult<Event[]>;
};

/**
 * Failed `useEventsQuery` result.
 *
 * `isError` is true, `data` is undefined.
 * @param error - Defaults to a generic load failure message.
 * @example
 * vi.mocked(useEventsQuery).mockReturnValue(mockEventsError(new Error("500")));
 */
export const mockEventsError = (
  error = new Error("Failed to load events")
): UseQueryResult<Event[]> => {
  return {
    data: undefined,
    isLoading: false,
    isError: true,
    error,
  } as unknown as UseQueryResult<Event[]>;
};
