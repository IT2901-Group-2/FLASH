import {
  createQueryClientWithWrapper,
  createQueryClientWrapper,
  makeBatchUpdateImageInput,
  makeCreateImageInput,
  makeDeleteImageInput,
  makeImage,
  makeUpdateImageInput,
  makeUploadedImageCount,
  mockImagePage,
  mockJsonResponse,
  mockServerErrorResponse,
} from "@test-config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  imagesKeys,
  useImagesQuery,
  useUploadImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
  useUploadedImageCountQuery,
  useBatchUpdateImageMutation,
} from "../useImages";

let wrapper: ReturnType<typeof createQueryClientWrapper>;
beforeEach(() => {
  wrapper = createQueryClientWrapper();
});

describe("useImagesQuery", () => {
  it("returns images on a successful response", async () => {
    const images = mockImagePage([makeImage(), makeImage()]);
    vi.stubGlobal("fetch", mockJsonResponse(images));

    const { result } = renderHook(() => useImagesQuery("ev-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0]).toStrictEqual(images);
  });

  it("calls the correct URL for an event", async () => {
    const fetchMock = mockJsonResponse(mockImagePage([makeImage()]));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useImagesQuery("ev-42"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/events/ev-42/images");
  });

  it("appends query string when params are provided", async () => {
    const fetchMock = mockJsonResponse(mockImagePage([]));
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
  it("calls POST /api/events/:eventId/images", async () => {
    const fetchMock = mockJsonResponse(makeImage());
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUploadImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(makeCreateImageInput({ eventId: "event-1" }))
    );

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/events/event-1/images");
    expect(init.method).toBe("POST");
  });

  it("returns the created image on success", async () => {
    const image = makeImage();
    vi.stubGlobal("fetch", mockJsonResponse(image));

    const { result } = renderHook(() => useUploadImageMutation(), { wrapper });
    const created = await act(async () =>
      result.current.mutateAsync(makeCreateImageInput())
    );

    expect(created).toMatchObject(image);
  });

  it("uploads an image and invalidates cache", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(makeImage()));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUploadImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(makeCreateImageInput({ eventId: "event-1" }))
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: imagesKeys.event("event-1") })
    );
  });

  it("only invalidates the cache for the uploaded event, not others", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(makeImage()));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUploadImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(makeCreateImageInput({ eventId: "event-1" }))
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: imagesKeys.event("event-1") })
    );
    expect(invalidateSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: imagesKeys.event("event-2") })
    );
  });

  it("enters error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useUploadImageMutation(), { wrapper });
    await act(async () => result.current.mutate(makeCreateImageInput()));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useUpdateImageMutation", () => {
  it("calls PATCH /api/events/:eventId/images/:imageId", async () => {
    const fetchMock = mockJsonResponse(makeImage());
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUpdateImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(
        makeUpdateImageInput({ eventId: "event-1", imageId: "image-1" })
      )
    );

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/events/event-1/images/image-1");
    expect(init.method).toBe("PATCH");
  });

  it("returns the updated image on success", async () => {
    const image = makeImage();
    vi.stubGlobal("fetch", mockJsonResponse(image));

    const { result } = renderHook(() => useUpdateImageMutation(), { wrapper });
    const updated = await act(async () =>
      result.current.mutateAsync(makeUpdateImageInput())
    );

    expect(updated).toMatchObject(image);
  });

  it("invalidates the event images cache on success", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(makeImage()));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(
        makeUpdateImageInput({ eventId: "event-1", data: { isApproved: false } })
      )
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: imagesKeys.event("event-1") })
    );
  });

  it("enters error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useUpdateImageMutation(), { wrapper });
    await act(async () => result.current.mutate(makeUpdateImageInput()));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useBatchUpdateImageMutation", () => {
  it("calls PATCH /api/events/:eventId/images with ids and isApproved", async () => {
    const fetchMock = mockJsonResponse([makeImage(), makeImage()]);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useBatchUpdateImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(
        makeBatchUpdateImageInput({
          eventId: "event-1",
          ids: ["image-1", "image-2"],
          isApproved: true,
        })
      )
    );

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/events/event-1/images");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toStrictEqual({
      ids: ["image-1", "image-2"],
      isApproved: true,
    });
  });

  it("returns the updated images array on success", async () => {
    vi.stubGlobal("fetch", mockJsonResponse([makeImage(), makeImage()]));

    const { result } = renderHook(() => useBatchUpdateImageMutation(), { wrapper });
    const updated = await act(async () =>
      result.current.mutateAsync(makeBatchUpdateImageInput())
    );

    expect(updated).toHaveLength(2);
  });

  it("invalidates the event images cache on success", async () => {
    vi.stubGlobal("fetch", mockJsonResponse([makeImage()]));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useBatchUpdateImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(makeBatchUpdateImageInput({ eventId: "event-1" }))
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: imagesKeys.event("event-1") })
    );
  });

  it("enters error state on a server error", async () => {
    vi.stubGlobal("fetch", mockServerErrorResponse());

    const { result } = renderHook(() => useBatchUpdateImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutate({ eventId: "ev-1", ids: ["img-1"], isApproved: true })
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useDeleteImageMutation", () => {
  it("calls DELETE /api/events/:eventId/images/:imageId", async () => {
    const fetchMock = mockJsonResponse(makeImage());
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDeleteImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(
        makeDeleteImageInput({ eventId: "event-1", imageId: "image-1" })
      )
    );

    const [calledUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toContain("/api/events/event-1/images/image-1");
    expect(init.method).toBe("DELETE");
  });

  it("invalidates the event images cache on success", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(makeImage()));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(makeDeleteImageInput({ eventId: "event-1" }))
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: imagesKeys.event("event-1") })
    );
  });

  it("only invalidates the cache for the deleted image's event", async () => {
    vi.stubGlobal("fetch", mockJsonResponse(makeImage()));
    const { wrapper, queryClient } = createQueryClientWithWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteImageMutation(), { wrapper });
    await act(async () =>
      result.current.mutateAsync(
        makeDeleteImageInput({ eventId: "event-1", imageId: "image-1" })
      )
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: imagesKeys.event("event-1") })
    );
    expect(invalidateSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: imagesKeys.event("event-2") })
    );
  });
});
