import { vi } from "vitest";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Image } from "@/db";
import { makeImage, makeImages } from "../factories/image.factory";
import {
  BatchUpdateImageInput,
  CreateImageInput,
  DeleteImageInput,
  UpdateImageInput,
} from "@/hooks/useImages";
import { mockQueryResult } from "./useQuery.mock";

// ---------------------------------------------------------------------------
// Default return values
// ---------------------------------------------------------------------------

/**
 * Idle default for `useImagesQuery`. Used internally by `imageHooksMock()`.
 * In tests, prefer `mockImagesLoaded` / `mockImagesLoading` / `mockImagesError`.
 */
export const defaultImagesQueryReturn = {
  data: undefined as Image[] | undefined,
  isLoading: false,
  isError: false,
} as UseQueryResult<Image[]>;

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
 * Successful `useImagesQuery` result with the given images.
 * @example
 * beforeEach(() => {
 *   vi.mocked(useImagesQuery).mockReturnValue(mockImagesLoaded(makePendingImagesForEvent("event-1")));
 * });
 */
export const mockImagesLoaded = (images: Image[]): UseQueryResult<Image[]> =>
  mockQueryResult({ data: images });

/**
 * Loading `useImagesQuery` result.
 *
 * `data` is undefined, `isLoading` is true.
 * @example
 * vi.mocked(useImagesQuery).mockReturnValue(mockImagesLoading());
 */
export const mockImagesLoading = (): UseQueryResult<Image[]> =>
  mockQueryResult({ isLoading: true });

/**
 * Failed `useImagesQuery` result.
 * `isError` is true, `data` is undefined.
 * @param error - Defaults to a generic load failure message.
 * @example
 * vi.mocked(useImagesQuery).mockReturnValue(mockImagesError(new Error("403 Forbidden")));
 */
export const mockImagesError = (error?: Error): UseQueryResult<Image[]> =>
  mockQueryResult({ error, isError: true });

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
