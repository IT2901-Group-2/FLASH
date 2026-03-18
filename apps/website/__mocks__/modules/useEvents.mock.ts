import { vi } from "vitest";
import {
  defaultEventsQueryReturn,
  defaultEventCodeQueryReturn,
  defaultCreateEventMutationReturn,
  defaultUpdateEventMutationReturn,
  defaultDeleteEventMutationReturn,
} from "../hooks/useEvents.mock";

/**
 * Drop-in `vi.mock()` factory for `@/hooks/useImages`.
 *
 * All hooks return typed idle/empty defaults. Override individual hooks
 * per-test using `vi.mocked()`.
 *
 * @example
 * // vitest.setup.tsx — register once globally
 * vi.mock("@/hooks/useImages", () => imageHooksMock());
 *
 * // YourComponent.test.tsx — override per test
 * import { useImagesQuery } from "@/hooks/useImages";
 * import { mockImagesLoaded, makePendingImagesForEvent } from "@test-config";
 *
 * vi.mocked(useImagesQuery).mockReturnValue(
 *   mockImagesLoaded(makePendingImagesForEvent("event-1"))
 * );
 */
export const eventHooksMock = () => ({
  eventsKeys: {
    all: ["events"],
    event: (eventId?: string) => ["events", eventId],
  },
  useEventsQuery: vi.fn(() => ({ ...defaultEventsQueryReturn })),
  useEventCodeQuery: vi.fn(() => ({ ...defaultEventCodeQueryReturn })),
  useCreateEventMutation: vi.fn(() => ({ ...defaultCreateEventMutationReturn })),
  useUpdateEventMutation: vi.fn(() => ({ ...defaultUpdateEventMutationReturn })),
  useDeleteEventMutation: vi.fn(() => ({ ...defaultDeleteEventMutationReturn })),
});
