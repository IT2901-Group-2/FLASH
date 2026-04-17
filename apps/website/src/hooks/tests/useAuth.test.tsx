import {
  createQueryClientWithWrapper,
  createQueryClientWrapper,
  mockCookieStore,
  mockJsonResponse,
  mockServerErrorResponse,
  mockUnauthorizedResponse,
} from "@test-config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  useAuth,
  useAuthRefresh,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} from "../useAuth";

const okResponse = { ok: true as const };
const mockGetAuth = vi.fn();
vi.mock("@/actions/auth", () => ({
  getAuth: () => mockGetAuth(),
}));

let wrapper: ReturnType<typeof createQueryClientWrapper>;
beforeEach(() => {
  wrapper = createQueryClientWrapper();
});

describe("useAuth", () => {
  it("returns auth state from the server action", async () => {
    mockGetAuth.mockResolvedValue(okResponse);
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual(okResponse);
  });

  it("registers a cookieStore change listener on mount", () => {
    const { wrapper } = createQueryClientWithWrapper();
    renderHook(() => useAuth(), { wrapper });

    expect(mockCookieStore.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("removes the cookieStore listener on unmount", () => {
    const { wrapper } = createQueryClientWithWrapper();
    const { unmount } = renderHook(() => useAuth(), { wrapper });
    unmount();

    expect(mockCookieStore.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("invalidates the auth state query when the cookieStore change event fires", async () => {
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    renderHook(() => useAuth(), { wrapper });

    const [, handler] = mockCookieStore.addEventListener.mock.calls[0] as [
      string,
      () => void,
    ];

    await act(async () => handler());
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["auth", "state"] })
    );
  });
});

describe("useAuthRefresh", () => {
  it("returns ok on a successful refresh", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(okResponse));

    const { result } = renderHook(() => useAuthRefresh(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual(okResponse);
  });

  it("calls POST /api/auth/refresh", async () => {
    const fetchMock = mockJsonResponse(okResponse);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useAuthRefresh(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/auth/refresh");
    expect(init.method).toBe("POST");
  });

  it("enters an error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse("Token expired"));

    const { result } = renderHook(() => useAuthRefresh(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error?.message).toBe("Token expired");
  });
});

describe("useLoginMutation", () => {
  it("calls POST /api/auth/login with the password", async () => {
    const fetchMock = mockJsonResponse(okResponse);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useLoginMutation(), { wrapper });
    await act(async () => result.current.mutateAsync({ password: "secret" }));

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/auth/login");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toStrictEqual({ password: "secret" });
  });

  it("logs in and sets auth query data on success", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(okResponse));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const setDataSpy = vi.spyOn(queryClient, "setQueryData");

    const { result } = renderHook(() => useLoginMutation(), { wrapper });
    const data = await act(async () =>
      result.current.mutateAsync({ password: "secret" })
    );

    expect(setDataSpy).toHaveBeenCalledWith(["auth"], okResponse);
    expect(data).toStrictEqual(okResponse);
  });

  it("enters error state on unauthorized response", async () => {
    vi.stubGlobal("fetch", mockUnauthorizedResponse("Unauthorized"));

    const { result } = renderHook(() => useLoginMutation(), { wrapper });
    await act(async () => result.current.mutate({ password: "wrong" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Unauthorized");
  });

  it("enters error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse("Invalid password"));

    const { result } = renderHook(() => useLoginMutation(), { wrapper });
    await act(async () => result.current.mutate({ password: "wrong_password" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Invalid password");
  });
});

describe("useLogoutMutation", () => {
  it("calls POST /api/auth/logout", async () => {
    const fetchMock = mockJsonResponse(okResponse);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });
    await act(async () => result.current.mutateAsync());

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/auth/logout");
    expect(init.method).toBe("POST");
  });

  it("clears auth state in the query cache on success", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(okResponse));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const setDataSpy = vi.spyOn(queryClient, "setQueryData");

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });
    await act(async () => result.current.mutateAsync());

    expect(setDataSpy).toHaveBeenCalledWith(["auth"], null);
  });

  it("enters error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });
    await act(async () => result.current.mutate());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useRefreshMutation", () => {
  it("refreshes token and sets auth query data on success", async () => {
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify(okResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useRefreshMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setQueryDataSpy).toHaveBeenCalledWith(["auth"], okResponse);
  });

  it("clears auth state on refresh failure", async () => {
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Refresh token expired" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          })
      )
    );

    const { result } = renderHook(() => useRefreshMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(setQueryDataSpy).toHaveBeenCalledWith(["auth"], null);
  });

  it("exposes refresh as an alias for mutateAsync", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify(okResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useRefreshMutation(), { wrapper });

    expect(typeof result.current.refresh).toBe("function");

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
