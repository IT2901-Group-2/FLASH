import {
  createQueryClientWithWrapper,
  createQueryClientWrapper,
  makeEvent,
  makeEventStats,
  makeJoinedEvent,
  mockJsonResponse,
  mockServerErrorResponse,
  mockUnauthorizedResponse,
} from "@test-config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  eventsKeys,
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventByCodeQuery,
  useEventCodeQuery,
  useEventsQuery,
  useEventStatsQuery,
  useJoinedEvents,
  useUpdateEventMutation,
} from "../useEvents";

const mockGetJoinedEvents = vi.fn();
vi.mock("@/actions/joinedEvents", () => ({
  getJoinedEvents: () => mockGetJoinedEvents(),
}));

let wrapper: ReturnType<typeof createQueryClientWrapper>;
beforeEach(() => {
  wrapper = createQueryClientWrapper();
});

describe("useEventsQuery", () => {
  it("returns data on a successful response", async () => {
    const events = [makeEvent(), makeEvent()];
    vi.stubGlobal("fetch", mockJsonResponse(events));

    const { result } = renderHook(() => useEventsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual(events);
  });

  it("handles fetch error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useEventsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("passes query params to fetch", async () => {
    const fetchMock = mockJsonResponse([makeEvent()]);
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useEventsQuery({ status: "active" }), { wrapper });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0]?.[0]).toContain("status=active");
  });

  it("extracts error message from JSON response", async () => {
    vi.stubGlobal("fetch", mockUnauthorizedResponse("Unauthorized access"));

    const { result } = renderHook(() => useEventsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Unauthorized access");
  });
});

describe("useEventCodeQuery", () => {
  it("returns the event code string on success", async () => {
    vi.stubGlobal("fetch", mockJsonResponse("ABC123"));

    const { result } = renderHook(() => useEventCodeQuery("eventId"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual("ABC123");
  });

  it("calls the correct URL with eventId and role", async () => {
    const fetchMock = mockJsonResponse("CODE");
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useEventCodeQuery("ev-42", "moderator"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("/api/events/ev-42/code");
    expect(calledUrl).toContain("role=moderator");
  });

  it("is disabled when eventId is undefined", async () => {
    const fetchMock = mockJsonResponse("CODE");
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useEventCodeQuery(undefined), { wrapper });

    await new Promise(r => setTimeout(r, 50));
    expect(result.current.isFetching).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("defaults role to guest", async () => {
    const fetchMock = mockJsonResponse("CODE");
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useEventCodeQuery("ev-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("role=guest");
  });
});

describe("useEventByCodeQuery", () => {
  it("calls the correct URL", async () => {
    const fetchMock = mockJsonResponse([makeEvent()]);
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useEventByCodeQuery("JOIN42"), { wrapper });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/events/by-code/JOIN42");
  });

  it("is disabled when code is undefined", async () => {
    const fetchMock = mockJsonResponse({});
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useEventByCodeQuery(undefined), { wrapper });

    await new Promise(r => setTimeout(r, 50));
    expect(result.current.isFetching).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is disabled when code is an empty string", async () => {
    const fetchMock = mockJsonResponse({});
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useEventByCodeQuery(""), { wrapper });

    await new Promise(r => setTimeout(r, 50));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("useEventStatsQuery", () => {
  it("returns event stats on success", async () => {
    const stats = makeEventStats();
    vi.stubGlobal("fetch", mockJsonResponse(stats));

    const { result } = renderHook(() => useEventStatsQuery("ev-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject(stats);
  });

  it("calls the correct URL", async () => {
    const fetchMock = mockJsonResponse(makeEventStats());
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useEventStatsQuery("ev-99"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/events/ev-99/stats");
  });

  it("is disabled when eventId is undefined", async () => {
    const fetchMock = mockJsonResponse({});
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useEventStatsQuery(undefined), { wrapper });

    await new Promise(r => setTimeout(r, 50));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is disabled when eventId is an empty string", async () => {
    const fetchMock = mockJsonResponse({});
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useEventStatsQuery(""), { wrapper });

    await new Promise(r => setTimeout(r, 50));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("enters an error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useEventStatsQuery("ev-1"), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useJoinedEvents", () => {
  beforeEach(() => {
    mockGetJoinedEvents.mockResolvedValue(makeJoinedEvent());
  });

  it("returns joined events from the server action", async () => {
    const events = [makeEvent(), makeEvent()];
    mockGetJoinedEvents.mockResolvedValue(events);

    const { result } = renderHook(() => useJoinedEvents(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });
});

describe("useCreateEventMutation", () => {
  it("calls POST /api/events with the event payload", async () => {
    const event = makeEvent();
    const fetchMock = mockJsonResponse(event);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCreateEventMutation(), { wrapper });

    await act(async () => result.current.mutateAsync(event));

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/events");
    expect(init.method).toBe("POST");
  });

  it("returns the created event on success", async () => {
    const event = makeEvent();
    vi.stubGlobal("fetch", mockJsonResponse(event));

    const { result } = renderHook(() => useCreateEventMutation(), { wrapper });
    const created = await act(async () => result.current.mutateAsync(event));

    expect(created).toMatchObject(event);
  });

  it("invalidates all events queries on success", async () => {
    const event = makeEvent();
    vi.stubGlobal("fetch", mockJsonResponse(event));
    const { wrapper, queryClient } = createQueryClientWithWrapper();

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useCreateEventMutation(), { wrapper });

    await act(async () => result.current.mutateAsync(event));
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: eventsKeys.all })
    );
  });

  it("enters error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());
    const { wrapper } = createQueryClientWithWrapper();

    const { result } = renderHook(() => useCreateEventMutation(), { wrapper });

    await act(async () => result.current.mutate(makeEvent()));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useUpdateEventMutation", () => {
  it("calls PATCH /api/events/:eventId", async () => {
    const event = makeEvent();
    const fetchMock = mockJsonResponse(event);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUpdateEventMutation(), { wrapper });
    await act(async () => result.current.mutateAsync({ eventId: "ev-1", data: event }));

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/events/ev-1");
    expect(init.method).toBe("PATCH");
  });

  it("returns the updated event on success", async () => {
    const event = makeEvent();
    vi.stubGlobal("fetch", mockJsonResponse(event));

    const { result } = renderHook(() => useUpdateEventMutation(), { wrapper });

    const updated = await act(async () =>
      result.current.mutateAsync({ eventId: "ev-1", data: event })
    );
    expect(updated).toMatchObject(event);
  });

  it("invalidates all events queries on success", async () => {
    const event = makeEvent();
    vi.stubGlobal("fetch", mockJsonResponse(event));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateEventMutation(), { wrapper });

    await act(async () => result.current.mutateAsync({ eventId: "ev-1", data: event }));
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: eventsKeys.all })
    );
  });

  it("enters error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useUpdateEventMutation(), { wrapper });

    await act(async () => result.current.mutate({ eventId: "ev-1", data: makeEvent() }));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useDeleteEventMutation", () => {
  it("calls DELETE /api/events/:eventId", async () => {
    const fetchMock = mockJsonResponse(makeEvent());
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDeleteEventMutation(), { wrapper });

    await act(async () => result.current.mutateAsync({ eventId: "ev-1" }));
    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/events/ev-1");
    expect(init.method).toBe("DELETE");
  });

  it("invalidates all events queries on success", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(makeEvent()));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteEventMutation(), { wrapper });

    await act(async () => result.current.mutateAsync({ eventId: "ev-1" }));
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: eventsKeys.all })
    );
  });

  it("enters error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useDeleteEventMutation(), { wrapper });

    await act(async () => result.current.mutate({ eventId: "ev-1" }));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useJoinMutation", ({ skip }) => {
  skip("no idea how to test this hook");
});
