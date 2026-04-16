import { vi } from "vitest";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import type { CreateEvent, Event, EventStats, GetEventsPage, UpdateEvent } from "@/db";
import { makeEvent } from "../factories/event.factory";
import { mockQueryResult } from "./useQuery.mock";
import { JoinedEvent } from "@/actions/joinedEvents";

type EventsInfiniteQueryResult = UseInfiniteQueryResult<
  InfiniteData<GetEventsPage, unknown>,
  Error
>;

// ---------------------------------------------------------------------------
// Default return values
// ---------------------------------------------------------------------------

/**
 * Idle default for `useEventsQuery`. Used internally by `eventHooksMock()`.
 * In tests, prefer `mockEventsLoaded` / `mockEventsLoading` / `mockEventsError`.
 */
export const defaultEventsQueryReturn = {
  data: undefined,
  isLoading: false,
  isError: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
} as unknown as EventsInfiniteQueryResult;

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
 * Idle default for `useEventStatsQuery`. Used internally by `eventHooksMock()`.
 * In tests, prefer `mockEventStatsLoaded` / `mockEventStatsLoading` / `mockEventStatsError`.
 */
export const defaultEventStatsQueryReturn = {
  data: undefined as EventStats | undefined,
  isLoading: false,
  isError: false,
} as UseQueryResult<EventStats>;

/**
 * Idle default for `useJoinedEventsQuery`. Used internally by `eventHooksMock()`.
 * In tests, prefer `mockJoinedEventsLoaded` / `mockJoinedEventsLoading` / `mockJoinedEventsError`.
 *
 * @example
 * vi.mocked(useJoinedEvents).mockReturnValue({ ...defaultJoinedEventsQueryReturn, data: [makeJoinedEvent()] });
 */
export const defaultJoinedEventsQueryReturn = {
  data: undefined as EventStats | undefined,
  isLoading: false,
  isError: false,
} as UseQueryResult<JoinedEvent[]>;

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
export const mockEventsLoaded = (events: Event[]): EventsInfiniteQueryResult =>
  mockQueryResult({ data: events });

/**
 * Loading `useEventsQuery` result.
 *
 * `data` is undefined, `isLoading` is true.
 * @example
 * vi.mocked(useEventsQuery).mockReturnValue(mockEventsLoading());
 */
export const mockEventsLoading = (): EventsInfiniteQueryResult =>
  mockQueryResult({ isLoading: true });

/**
 * Failed `useEventsQuery` result.
 *
 * `isError` is true, `data` is undefined.
 * @param error - Defaults to a generic load failure message.
 * @example
 * vi.mocked(useEventsQuery).mockReturnValue(mockEventsError(new Error("500")));
 */
export const mockEventsError = (error?: Error): EventsInfiniteQueryResult =>
  mockQueryResult({ error, isError: true });

/**
 * Successful `useEventStatsQuery` result with the given stats.
 *
 * @example
 * beforeEach(() => {
 *   vi.mocked(useEventStatsQuery)
 *      .mockReturnValue(
 *         mockEventStatsLoaded([makeEventStats({ pendingImages: 5 })]
 *      )
 *    );
 * });
 */
export const mockEventStatsLoaded = (
  eventStats: EventStats
): UseQueryResult<EventStats> => mockQueryResult({ data: eventStats });

/**
 * Loading `useEventStatsQuery` result.
 * `data` is undefined, `isLoading` is true.
 *
 * @example
 * vi.mocked(useEventStatsQuery).mockReturnValue(mockEventStatsLoading());
 */
export const mockEventStatsLoading = (): UseQueryResult<EventStats> =>
  mockQueryResult({ isLoading: true });

/**
 * Failed `useEventStatsQuery` result.
 * `isError` is true, `data` is undefined.
 *
 * @example
 * vi.mocked(useEventStatsQuery).mockReturnValue(mockEventStatsError(new Error("500")));
 *
 * @param error - Defaults to a generic load failure message.
 */
export const mockEventStatsError = (error?: Error): UseQueryResult<EventStats> =>
  mockQueryResult({ error, isError: true });

/**
 * Successful `useJoinedEventsQuery` result with the gived joined events.
 *
 * @example
 * beforeEach(() => {
 *   vi.mocked(useJoinedEventsQuery)
 *      .mockReturnValue(
 *         mockJoinedEventsLoaded([makeJoinedEvent({ isModerator: true })]
 *      )
 *    );
 * });
 */
export const mockJoinedEventsLoaded = (
  joinedEvents?: JoinedEvent[]
): UseQueryResult<JoinedEvent[]> => mockQueryResult({ data: joinedEvents });
