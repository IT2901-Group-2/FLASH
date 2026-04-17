import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  useAuthRefresh,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} from "../useAuth";
import { createQueryClientWithWrapper, createQueryClientWrapper } from "@test-config";

const mockOk = { ok: true as const };

let wrapper: ReturnType<typeof createQueryClientWrapper>;
beforeEach(() => {
  wrapper = createQueryClientWrapper();
});

describe("useAuthRefresh", () => {
  it("fetches auth state successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify(mockOk), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useAuthRefresh(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toStrictEqual(mockOk);
  });

  it("returns null when refresh fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          })
      )
    );

    const { result } = renderHook(() => useAuthRefresh(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("extracts error message from JSON response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Token expired" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          })
      )
    );

    const { result } = renderHook(() => useAuthRefresh(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Token expired");
  });
});

describe("useLoginMutation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("logs in and sets auth query data on success", async () => {
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify(mockOk), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    result.current.mutate({ password: "secret123" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setQueryDataSpy).toHaveBeenCalledWith(["auth"], mockOk);
  });

  it("sends password in request body", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify(mockOk), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    result.current.mutate({ password: "mypassword" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const [, init] = fetchMock.mock.calls[0]!;
    const body = JSON.parse(init!.body as string);

    expect(body.password).toBe("mypassword");
  });

  it("handles login failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Invalid password" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          })
      )
    );

    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    result.current.mutate({ password: "wrongpassword" });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Invalid password");
  });
});

describe("useLogoutMutation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("logs out and sets auth query data to null", async () => {
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify(mockOk), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setQueryDataSpy).toHaveBeenCalledWith(["auth"], null);
  });

  it("calls POST /api/auth/logout", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify(mockOk), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/auth/logout");
  });
});

describe("useRefreshMutation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("refreshes token and sets auth query data on success", async () => {
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify(mockOk), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useRefreshMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setQueryDataSpy).toHaveBeenCalledWith(["auth"], mockOk);
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
          new Response(JSON.stringify(mockOk), {
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
