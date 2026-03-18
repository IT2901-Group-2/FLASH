/**
 * Mock factories for context providers used across the app.
 *
 * Usage:
 *   vi.mock("@/providers/EventAuthContext", () => eventAuthMock());
 *   vi.mock("@/providers/JoinedEventsContext", () => joinedEventsMock());
 */
import { vi } from "vitest";
import { makeUser } from "../factories/user.factory";
import type { MockUser } from "../factories/user.factory";

/**
 * Returns a mock for @/providers/EventAuthContext.
 * Default: authenticated, non-moderator user.
 *
 * @example
 * vi.mock("@/providers/EventAuthContext", () => eventAuthMock());
 *
 * // Override for a specific test:
 * vi.mocked(useEventAuth).mockReturnValue(makeUser({ isModerator: true }));
 */
export const eventAuthMock = (user: Partial<MockUser> = {}) => ({
  useEventAuth: vi.fn(() => makeUser(user)),
});

/**
 * Returns a mock for @/providers/JoinedEventsContext.
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
