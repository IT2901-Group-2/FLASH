import { AuthState } from "@/hooks/useAuth";
import { EventAuth } from "@/providers/EventAuthContext";

/**
 * Creates a fully-populated User. Any field can be overridden.
 *
 * @example
 * makeEventAuth(); // { nickname: "test-user", isModerator: false, isAuthenticated: true }
 * makeEventAuth({ nickname: "John Doe" }); // { nickname: "John Doe", isModerator: false, isAuthenticated: true }
 * makeEventAuth({ isModerator: true }); // { nickname: "test-user", isModerator: true, isAuthenticated: true }
 * makeEventAuth({ isAuthenticated: false }); // { nickname: undefined, isModerator: undefined, isAuthenticated: false }
 */
export const makeEventAuth = (overrides: Partial<EventAuth> = {}): EventAuth =>
  overrides.isAuthenticated === false
    ? { nickname: undefined, isModerator: undefined, isAuthenticated: false }
    : {
        nickname: overrides.nickname ?? "test-user",
        isModerator: overrides.isModerator ?? false,
        isAuthenticated: true,
      };

/**
 * Creates a mock auth response body (used for useAuthRefresh hook tests).
 *
 * @example
 * const auth = makeAuthState();  // { ok: true }
 */
export const makeAuthState = (overrides: Partial<AuthState> = {}): AuthState => {
  return { ok: true, ...overrides };
};
