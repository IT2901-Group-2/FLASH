import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import {
  imagesKeys,
  useImagesQuery,
  useUploadImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} from "../useImages";
import { Image } from "@/db";

const mockImage: Image = {
  id: "image-id",
  userId: "user1",
  eventId: "event-id",
  createdAt: new Date(),
  updatedAt: new Date(),
  isApproved: true,
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

describe("useImagesQuery", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches images successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ items: [mockImage], nextCursor: null }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      ) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useImagesQuery("event-1"), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0]?.items).toStrictEqual([mockImage]);
  });

  it("does not fetch when eventId is empty", () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useImagesQuery(""), {
      wrapper: createWrapper().wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(fetchMock).not.toHaveBeenCalled();
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

    const { result } = renderHook(() => useImagesQuery("event-1"), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("passes approval query param to fetch", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({ items: [], nextCursor: null }), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useImagesQuery("event-1", { approval: "pending" }), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(fetchMock.mock.calls[0]?.[0]).toContain("approval=pending");
  });

  it("passes id query params to fetch (sorted)", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({ items: [], nextCursor: null }), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useImagesQuery("event-1", { id: ["img-b", "img-a"] }), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const url = fetchMock.mock.calls[0]?.[0] as string;
    expect(url).toContain("id=img-a");
    expect(url).toContain("id=img-b");
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

    const { result } = renderHook(() => useImagesQuery("event-1"), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Testing custom error");
  });
  it("fetches next page when API returns paginated objects", async () => {
    const firstPage = {
      items: [
        { ...mockImage, id: "img-1" },
        { ...mockImage, id: "img-2" },
      ],
      nextCursor: 2,
    };
    const secondPage = {
      items: [{ ...mockImage, id: "img-3" }],
      nextCursor: null,
    };

    const fetchMock = vi.fn<typeof fetch>(async input => {
      const url = String(input);

      if (url.includes("cursor=2")) {
        return new Response(JSON.stringify(secondPage), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(firstPage), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useImagesQuery("event-1", { pageSize: 2 }), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0]?.items.map(i => i.id)).toStrictEqual([
      "img-1",
      "img-2",
    ]);

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });
    expect(result.current.data?.pages[1]?.items.map(i => i.id)).toStrictEqual(["img-3"]);

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("pageSize=2");
    expect(fetchMock.mock.calls.some(call => String(call[0]).includes("cursor=2"))).toBe(
      true
    );
  });

  it("uses cursor from params as initial page param", async () => {
    const fetchMock = vi.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({ items: [], nextCursor: null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
    );

    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useImagesQuery("event-1", { cursor: 4, pageSize: 3 }), {
      wrapper: createWrapper().wrapper,
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const requestUrl = String(fetchMock.mock.calls[0]?.[0]);
    expect(requestUrl).toContain("cursor=4");
    expect(requestUrl).toContain("pageSize=3");
  });
});

describe("useUploadImageMutation", () => {
  it("uploads an image and invalidates cache", async () => {
    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const fetchMock = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify(mockImage), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUploadImageMutation(), { wrapper });

    const file = new File(["content"], "photo.jpg", { type: "image/jpeg" });
    result.current.mutate({ eventId: "event-1", file });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toContain("/api/events/event-1/images");
    expect(init?.method).toBe("POST");

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: imagesKeys.event("event-1"),
    });
  });
});

describe("useUpdateImageMutation", () => {
  it("updates an image and invalidates cache", async () => {
    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const fetchMock = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify(mockImage), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUpdateImageMutation(), { wrapper });

    result.current.mutate({
      eventId: "event-1",
      imageId: "img-1",
      data: { isApproved: true },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toContain("/api/events/event-1/images/img-1");
    expect(init?.method).toBe("PATCH");

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: imagesKeys.event("event-1"),
    });
  });
});

describe("useDeleteImageMutation", () => {
  it("deletes an image and invalidates cache", async () => {
    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const fetchMock = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify(mockImage), { status: 200 })
    );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDeleteImageMutation(), { wrapper });

    result.current.mutate({ eventId: "event-1", imageId: "img-99" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/events/event-1/images/img-99");

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: imagesKeys.event("event-1"),
    });
  });
});
