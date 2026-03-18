let _counter = 1;
const nextId = () => `user-${_counter++}`;

export type MockUser = {
  id: string;
  nickname: string;
  isAuthenticated: boolean;
  isModerator: boolean;
};

export type MockAuthState = {
  ok: boolean;
};

/**
 * Creates a fully-populated User. Any field can be overridden.
 *
 * @example
 * const user = makeUser({ nickname: "alice", isModerator: true });
 */
export function makeUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: nextId(),
    nickname: "test-user",
    isAuthenticated: true,
    isModerator: false,
    ...overrides,
  };
}

/**
 * Creates a moderator user.
 */
export function makeModerator(overrides: Partial<MockUser> = {}): MockUser {
  return makeUser({ nickname: "moderator", isModerator: true, ...overrides });
}

/**
 * Creates an unauthenticated guest user.
 */
export function makeGuest(overrides: Partial<MockUser> = {}): MockUser {
  return makeUser({ isAuthenticated: false, isModerator: false, ...overrides });
}

/**
 * Creates a mock auth response body (used for useAuth hook tests).
 *
 * @example
 * const auth = makeAuthState();  // { ok: true }
 */
export function makeAuthState(overrides: Partial<MockAuthState> = {}): MockAuthState {
  return { ok: true, ...overrides };
}

/**
 * Resets the internal ID counter.
 * Call in beforeEach if ID stability matters.
 */
export function resetUserCounter() {
  _counter = 1;
}
