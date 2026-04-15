import { vi } from "vitest";
import {
  defaultEventsQueryReturn,
  defaultEventCodeQueryReturn,
  defaultCreateEventMutationReturn,
  defaultUpdateEventMutationReturn,
  defaultDeleteEventMutationReturn,
  defaultEventStatsQueryReturn,
  defaultJoinedEventsQueryReturn,
} from "../hooks/useEvents.mock";

/**
 * Drop-in vi.mock factory for @/hooks/useEvents.
 *
 * @example
 * // vitest.setup.tsx. Register once globally
 * vi.mock("@/hooks/useEvents", () => eventHooksMock());
 *
 * // YourComponent.test.tsx. Override per test
 * import { useEventsQuery } from "@/hooks/useEvents";
 * import { mockEventsLoaded, makeEvent } from "@test-config";
 *
 * vi.mocked(useEventsQuery).mockReturnValue(mockEventsLoaded([makeEvent()]));
 */
export const eventHooksMock = () => ({
  eventsKeys: {
    all: ["events"],
    event: (eventId?: string) => ["events", eventId],
  },
  useEventsQuery: vi.fn(() => defaultEventsQueryReturn),
  useEventCodeQuery: vi.fn(() => defaultEventCodeQueryReturn),
  useEventStatsQuery: vi.fn(() => defaultEventStatsQueryReturn),
  useJoinedEvents: vi.fn(() => defaultJoinedEventsQueryReturn),
  useCreateEventMutation: vi.fn(() => defaultCreateEventMutationReturn),
  useUpdateEventMutation: vi.fn(() => defaultUpdateEventMutationReturn),
  useDeleteEventMutation: vi.fn(() => defaultDeleteEventMutationReturn),
});
