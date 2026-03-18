import { vi } from "vitest";
import { makeUser } from "../factories/user.factory";
import { EventAuth } from "@/providers/EventAuthContext";

/**
 * Returns a mock for "@/providers/EventAuthContext".
 *
 * Default: authenticated, non-moderator user.
 *
 * @example
 * vi.mock("@/providers/EventAuthContext", () => eventAuthMock());
 *
 * // Override for a specific test:
 * vi.mocked(useEventAuth).mockReturnValue(makeUser({ isModerator: true }));
 */
export const eventAuthMock = (user: Partial<EventAuth> = {}) => ({
  useEventAuth: vi.fn(() => makeUser(user)),
});

/**
 * Returns a mock for "@/providers/JoinedEventsContext".
 *
 * Default: empty joined events array.
 *
 * @example
 * vi.mock("@/providers/JoinedEventsContext", () => joinedEventsMock());
 *
 * // Pre-seed joined events:
 * vi.mock("@/providers/JoinedEventsContext", () =>
 *   joinedEventsMock(["event-1", "event-2"])
 * );
 */
export const joinedEventsMock = (joinedEventIds: string[] = []) => ({
  useJoinedEvents: vi.fn(() => joinedEventIds),
});
