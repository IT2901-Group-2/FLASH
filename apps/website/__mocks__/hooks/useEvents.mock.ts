import { vi } from "vitest";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { CreateEvent, Event, UpdateEvent } from "@/db";
import { makeEvent } from "../factories/event.factory";

// ----------------------------
// Default return values
// ----------------------------

export const defaultEventsQueryReturn = {
  data: undefined as Event[] | undefined,
  isLoading: false,
  isError: false,
} as UseQueryResult<Event[]>;

export const defaultEventCodeQueryReturn = {
  data: undefined as string | undefined,
  isLoading: false,
  isError: false,
} as UseQueryResult<string>;

export const defaultCreateEventMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(makeEvent()),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<Event, Error, CreateEvent>;

export const defaultUpdateEventMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(makeEvent()),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<Event, Error, { eventId: string; data: UpdateEvent }>;

export const defaultDeleteEventMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<void, Error, { eventId: string }>;

// ----------------------------
// Mock setup helpers
// ----------------------------

/**
 * Sets up all useEvents hooks with idle/empty defaults.
 * Call this inside beforeEach to get a clean slate.
 *
 * Requires the hooks module to already be mocked with vi.mock:
 * @example
 * vi.mock("@/hooks/useEvents");
 *
 * beforeEach(() => {
 *   setupEventsMocks();
 * });
 */
export function setupEventsMocks() {
  const {
    useEventsQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useEventCodeQuery,
  } = vi.mocked(require("@/hooks/useEvents"));

  useEventsQuery?.mockReturnValue({ ...defaultEventsQueryReturn });
  useEventCodeQuery?.mockReturnValue({ ...defaultEventCodeQueryReturn });
  useCreateEventMutation?.mockReturnValue({ ...defaultCreateEventMutationReturn });
  useUpdateEventMutation?.mockReturnValue({ ...defaultUpdateEventMutationReturn });
  useDeleteEventMutation?.mockReturnValue({ ...defaultDeleteEventMutationReturn });
}

/**
 * Creates a mock return value for useEventsQuery with pre-loaded events.
 *
 * @example
 * vi.mocked(useEventsQuery).mockReturnValue(
 *   mockEventsLoaded([makeEvent({ name: "Birthday" })])
 * );
 */
export function mockEventsLoaded(events: Event[]): UseQueryResult<Event[]> {
  return {
    data: events,
    isLoading: false,
    isError: false,
  } as UseQueryResult<Event[]>;
}

export function mockEventsLoading(): UseQueryResult<Event[]> {
  return {
    data: undefined,
    isLoading: true,
    isError: false,
  } as UseQueryResult<Event[]>;
}

export function mockEventsError(
  error = new Error("Failed to load events")
): UseQueryResult<Event[]> {
  return {
    data: undefined,
    isLoading: false,
    isError: true,
    error,
  } as unknown as UseQueryResult<Event[]>;
}
