import { vi } from "vitest";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import type { Image } from "@/db";
import { makeImage, makeImages } from "../factories/image.factory";
import {
  BatchUpdateImageInput,
  CreateImageInput,
  DeleteImageInput,
  UpdateImageInput,
} from "@/hooks/useImages";

type ImagesPage = {
  items: Image[];
  nextCursor: number | null;
};

type ImagesInfiniteQueryResult = UseInfiniteQueryResult<
  InfiniteData<ImagesPage, unknown>,
  Error
>;

// ---------------------------------------------------------------------------
// Default return values
// ---------------------------------------------------------------------------

/**
 * Idle default for `useImagesQuery`. Used internally by `imageHooksMock()`.
 * In tests, prefer `mockImagesLoaded` / `mockImagesLoading` / `mockImagesError`.
 */
export const defaultImagesQueryReturn = {
  data: undefined,
  isLoading: false,
  isError: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
} as unknown as ImagesInfiniteQueryResult;

/**
 * Idle default for `useUploadImageMutation`. `mutateAsync` resolves with `makeImage()`.
 * Spread and replace `mutateAsync` to assert on the upload call:
 * @example
 * const mockUpload = vi.fn().mockResolvedValue(makeImage({ eventId: "event-1" }));
 * vi.mocked(useUploadImageMutation).mockReturnValue({ ...defaultUploadImageMutationReturn, mutateAsync: mockUpload });
 */
export const defaultUploadImageMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(makeImage()),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<Image, Error, CreateImageInput>;

/**
 * Idle default for `useUpdateImageMutation`. `mutateAsync` resolves with `makeImage()`.
 * Spread and replace `mutateAsync` to assert on approval changes:
 * @example
 * const mockUpdate = vi.fn().mockResolvedValue(makeImage({ isApproved: true }));
 * vi.mocked(useUpdateImageMutation).mockReturnValue({ ...defaultUpdateImageMutationReturn, mutateAsync: mockUpdate });
 */
export const defaultUpdateImageMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(makeImage()),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<
  Image,
  Error,
  { eventId: string; imageId: string; data: UpdateImageInput }
>;

/**
 * Idle default for `useBatchUpdateImageMutation`. `mutateAsync` resolves with `undefined`.
 * Spread and replace `mutateAsync` to assert on bulk approve/reject calls:
 * @example
 * const mockBatch = vi.fn().mockResolvedValue(undefined);
 * vi.mocked(useBatchUpdateImageMutation).mockReturnValue({ ...defaultBatchUpdateImageMutationReturn, mutateAsync: mockBatch });
 * expect(mockBatch).toHaveBeenCalledWith({ eventId: "event-1", ids: ["img-1", "img-2"], isApproved: true });
 */
export const defaultBatchUpdateImageMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<void, Error, BatchUpdateImageInput>;

/**
 * Idle default for `useDeleteImageMutation`. `mutateAsync` resolves with `undefined`.
 * Spread and replace `mutateAsync` to assert on deletion:
 * @example
 * const mockDelete = vi.fn().mockResolvedValue(undefined);
 * vi.mocked(useDeleteImageMutation).mockReturnValue({ ...defaultDeleteImageMutationReturn, mutateAsync: mockDelete });
 */
export const defaultDeleteImageMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<void, Error, DeleteImageInput>;

// ---------------------------------------------------------------------------
// State builders
// ---------------------------------------------------------------------------

/**
 * Creates a mock infinite-query result for images, suitable for use in tests.
 *
 * @example
 * mockImagesQueryResult({ data: [makeImage(), makeImage()] });
 * mockImagesQueryResult({ isLoading: true });
 * mockImagesQueryResult({ isError: true });
 */
export const mockImagesQueryResult = ({
  data,
  isLoading = false,
  isError = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  nextCursor = null,
  fetchNextPage = vi.fn(),
  error = new Error("Failed to load Images"),
}: {
  data?: Image[];
  isLoading?: boolean;
  isError?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  nextCursor?: number | null;
  fetchNextPage?: ReturnType<typeof vi.fn>;
  error?: Error;
}): ImagesInfiniteQueryResult => {
  return {
    data:
      isLoading || isError
        ? undefined
        : {
            pages: [{ items: data ?? [], nextCursor }],
            pageParams: [undefined],
          },
    error: isLoading || !isError ? null : error,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } as unknown as ImagesInfiniteQueryResult;
};

/**
 * Successful `useImagesQuery` result with the given images.
 * @example
 * beforeEach(() => {
 *   vi.mocked(useImagesQuery).mockReturnValue(mockImagesLoaded(makePendingImagesForEvent("event-1")));
 * });
 */
export const mockImagesLoaded = (images: Image[]): ImagesInfiniteQueryResult =>
  mockImagesQueryResult({ data: images });

/**
 * Loading `useImagesQuery` result.
 *
 * `data` is undefined, `isLoading` is true.
 * @example
 * vi.mocked(useImagesQuery).mockReturnValue(mockImagesLoading());
 */
export const mockImagesLoading = (): ImagesInfiniteQueryResult =>
  mockImagesQueryResult({ isLoading: true });

/**
 * Failed `useImagesQuery` result.
 * `isError` is true, `data` is undefined.
 * @param error - Defaults to a generic load failure message.
 * @example
 * vi.mocked(useImagesQuery).mockReturnValue(mockImagesError(new Error("403 Forbidden")));
 */
export const mockImagesError = (error?: Error): ImagesInfiniteQueryResult =>
  mockImagesQueryResult({ error, isError: true });

/**
 * Creates `count` pending images for the same event. Covers the standard moderation `beforeEach`.
 * Use `image.id` in assertions rather than hard-coding IDs. The factory counter can shift.
 * @param eventId - Defaults to `"event-1"`.
 * @param count   - Defaults to `3`.
 * @example
 * const IMAGES = makePendingImagesForEvent("event-1", 3);
 * beforeEach(() => { vi.mocked(useImagesQuery).mockReturnValue(mockImagesLoaded(IMAGES)); });
 * fireEvent.click(screen.getByTestId(`image-card-${IMAGES[0].id}`));
 */
export const makePendingImagesForEvent = (eventId = "event-1", count = 3): Image[] => {
  return makeImages(count, { eventId, isApproved: null });
};
