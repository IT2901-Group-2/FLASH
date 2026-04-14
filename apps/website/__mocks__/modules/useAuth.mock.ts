import { vi } from "vitest";
import { mockQueryResult } from "../hooks";

/**
 * Drop-in vi.mock factory for @/hooks/useAuth.
 *
 * @example
 * // vitest.setup.tsx. Register once globally
 * vi.mock("@/hooks/useAuth", () => authHooksMock());
 *
 * // YourComponent.test.tsx. Override per test
 * import { useAuth } from "@/hooks/useAuth";
 * import { mockAuthLoaded, makeAuth } from "@test-config";
 *
 * vi.mocked(useAuth).mockReturnValue(mockAuthLoaded(makeAuth()));
 */
export const authHooksMock = () => ({
  authKeys: {
    all: ["auth"],
    state: () => ["auth", "state"],
    refresh: () => ["auth", "refresh"],
  },

  useAuth: () => vi.fn(() => mockQueryResult({ data: { isAdmin: false } })),
  useAuthRefresh: () => vi.fn(),
  useLoginMutation: () => vi.fn(() => ({ ok: true })),
  useLogoutMutation: () => vi.fn(() => ({ ok: true })),
  useRefreshMutation: () => vi.fn(() => ({ ok: true })),
});
