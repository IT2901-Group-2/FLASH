import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import {
  eventsKeys,
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventCodeQuery,
  useEventsQuery,
  useUpdateEventMutation,
} from "../useEvents";
import { Event } from "@/db";

const mockEvent: Event = {
  id: "1",
  name: "Test event",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  uploadLimit: 5,
  isArchived: false,
  autoApprove: true,
  uploadsArePrivate: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
}

describe("useEventsQuery", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches events successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify([mockEvent]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useEventsQuery(), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toStrictEqual([mockEvent]);
  });

  it("handles fetch error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "failed to fetch" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
      )
    );

    const { result } = renderHook(() => useEventsQuery(), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("passes query params to fetch", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify([]), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useEventsQuery({ status: "active" }), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(fetchMock.mock.calls[0]?.[0]).toContain("status=active");
  });

  it("extracts error message from JSON response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ message: "Testing custom error" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          })
      )
    );

    const { result } = renderHook(() => useEventsQuery(), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Testing custom error");
  });
});

describe("useEventCodeQuery", () => {
  it("Fetches event code successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify("event-code"), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useEventCodeQuery("eventId"), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toStrictEqual("event-code");
  });
});

describe("useCreateEventMutation", () => {
  it("creates an event and invalidates cache", async () => {
    const { wrapper, queryClient } = createWrapper();

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const fetchMock = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify(mockEvent), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCreateEventMutation(), { wrapper });

    const input = {
      name: "Test",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-01-02"),
    };

    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalled();

    const call = fetchMock.mock.calls[0];
    expect(call).toBeDefined();
    const [, init] = call!;
    const body = JSON.parse(init!.body as string);

    expect(body.startDate).toContain("2025");
    expect(body.endDate).toContain("2025");

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: eventsKeys.all,
    });
  });
});

describe("useUpdateEventMutation", () => {
  it("updates an event and invalidates cache", async () => {
    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const fetchMock = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify(mockEvent), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUpdateEventMutation(), { wrapper });

    result.current.mutate({
      eventId: "123",
      data: { name: "Updated" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/events/123");

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: eventsKeys.all,
    });
  });
});

describe("useDeleteEventMutation", () => {
  it("deletes an event and invalidates cache", async () => {
    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const fetchMock = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify(mockEvent), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDeleteEventMutation(), { wrapper });

    result.current.mutate({ eventId: "999" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/events/999");

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: eventsKeys.all,
    });
  });
});
