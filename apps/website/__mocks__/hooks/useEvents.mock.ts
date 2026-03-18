import { vi } from "vitest";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { CreateEvent, Event, UpdateEvent } from "@/db";
import { makeEvent } from "../factories/event.factory";

// ---------------------------------------------------------------------------
// Default return values
// ---------------------------------------------------------------------------

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
