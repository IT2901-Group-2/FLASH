import {
  createQueryClientWrapper,
  makeImage,
  makeUploadedImageCount,
  mockJsonResponse,
  mockServerErrorResponse,
} from "@test-config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  imagesKeys,
  useImagesQuery,
  useUploadImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
  useUploadedImageCountQuery,
} from "../useImages";

let wrapper: ReturnType<typeof createQueryClientWrapper>;
beforeEach(() => {
  wrapper = createQueryClientWrapper();
});

describe("useImagesQuery", () => {
  it("returns images on a successful response", async () => {
    const images = [makeImage(), makeImage()];
    vi.stubGlobal("fetch", mockJsonResponse(images));

    const { result } = renderHook(() => useImagesQuery("ev-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual(images);
  });

  it("calls the correct URL for an event", async () => {
    const fetchMock = mockJsonResponse([makeImage()]);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useImagesQuery("ev-42"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/events/ev-42/images");
  });

  it("appends query string when params are provided", async () => {
    const fetchMock = mockJsonResponse([]);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(
      () => useImagesQuery("ev-1", { approval: "pending", id: ["img-b", "img-a"] }),
      {
        wrapper,
      }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const url = fetchMock.mock.calls[0]?.[0] as string;
    expect(url).toContain("approval=pending");
    expect(url).toContain("id=img-a");
    expect(url).toContain("id=img-b");
  });

  it("is disabled when eventId is undefined", async () => {
    const fetchMock = mockJsonResponse([]);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useImagesQuery(undefined), { wrapper });

    await new Promise(r => setTimeout(r, 50));
    expect(result.current.isFetching).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is disabled when eventId is an empty string", async () => {
    const fetchMock = mockJsonResponse([]);
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useImagesQuery(""), { wrapper });

    await new Promise(r => setTimeout(r, 50));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("enters an error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useImagesQuery("ev-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe("useUploadedImageCountQuery", () => {
  it("returns the uploaded count on success", async () => {
    const count = makeUploadedImageCount();
    vi.stubGlobal("fetch", mockJsonResponse(count));

    const { result } = renderHook(() => useUploadedImageCountQuery("ev-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toStrictEqual(count);
  });

  it("calls the correct URL", async () => {
    const fetchMock = mockJsonResponse(makeUploadedImageCount());
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUploadedImageCountQuery("ev-99"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/events/ev-99/uploaded");
  });

  it("is disabled when eventId is undefined", async () => {
    const fetchMock = mockJsonResponse({});
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUploadedImageCountQuery(undefined), {
      wrapper,
    });

    await new Promise(r => setTimeout(r, 50));
    expect(result.current.isFetching).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is disabled when eventId is an empty string", async () => {
    const fetchMock = mockJsonResponse({});
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useUploadedImageCountQuery(""), { wrapper });

    await new Promise(r => setTimeout(r, 50));
    expect(fetchMock).not.toHaveBeenCalled();
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

describe("useBatchUpdateImageMutation", () => {});

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
