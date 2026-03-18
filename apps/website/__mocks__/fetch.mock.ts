import { vi } from "vitest";

/**
 * Creates a vi.fn() that resolves to a JSON response with the given status.
 *
 * @example
 * vi.stubGlobal("fetch", mockJsonResponse({ ok: true }));
 * vi.stubGlobal("fetch", mockJsonResponse([event1, event2]));
 */
export function mockJsonResponse<T>(body: T, status = 200) {
  return vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      })
  ) as unknown as typeof fetch;
}

/**
 * Creates a vi.fn() that resolves to a 401 Unauthorized JSON response.
 * Optionally override the error message.
 *
 * @example
 * vi.stubGlobal("fetch", mockUnauthorizedResponse("Token expired"));
 */
export function mockUnauthorizedResponse(message = "Unauthorized") {
  return mockJsonResponse({ message }, 401);
}

/**
 * Creates a vi.fn() that resolves to a 500 Internal Server Error JSON response.
 *
 * @example
 * vi.stubGlobal("fetch", mockServerErrorResponse("Database unavailable"));
 */
export function mockServerErrorResponse(message = "Internal Server Error") {
  return mockJsonResponse({ message }, 500);
}

/**
 * Creates a vi.fn() that rejects.
 * Simulates a network failure.
 *
 * @example
 * vi.stubGlobal("fetch", mockNetworkFailure());
 */
export function mockNetworkFailure(message = "Network request failed") {
  return vi.fn(async () => {
    throw new Error(message);
  }) as unknown as typeof fetch;
}

/**
 * Extracts the parsed JSON body from the first call to a fetch mock.
 * Useful for asserting on request payloads.
 *
 * @example
 * const fetchMock = mockJsonResponse(mockEvent);
 * vi.stubGlobal("fetch", fetchMock);
 * ...
 * const body = getRequestBody(fetchMock);
 * expect(body.name).toBe("Birthday Bash");
 */
export function getRequestBody<T = Record<string, unknown>>(
  fetchMock: ReturnType<typeof vi.fn>,
  callIndex = 0
): T {
  const [, init] = fetchMock.mock.calls[callIndex] as [string, RequestInit];
  return JSON.parse(init?.body as string) as T;
}

/**
 * Extracts the URL string from the nth call to a fetch mock.
 *
 * @example
 * expect(getRequestUrl(fetchMock)).toContain("/api/events/123");
 */
export function getRequestUrl(
  fetchMock: ReturnType<typeof vi.fn>,
  callIndex = 0
): string {
  return fetchMock.mock.calls[callIndex]?.[0] as string;
}
