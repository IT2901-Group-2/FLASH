import { vi } from "vitest";
import {
  defaultImagesQueryReturn,
  defaultMyImagesQueryReturn,
  defaultUploadedImageCountQueryReturn,
  defaultUploadImageMutationReturn,
  defaultUpdateImageMutationReturn,
  defaultBatchUpdateImageMutationReturn,
  defaultDeleteImageMutationReturn,
} from "../hooks/useImages.mock";

/**
 * Drop-in `vi.mock()` factory for `@/hooks/useImages`.
 *
 * All hooks return typed idle/empty defaults. Override individual hooks
 * per-test using `vi.mocked()`.
 *
 * @example
 * // vitest.setup.tsx. Register once globally
 * vi.mock("@/hooks/useImages", () => imageHooksMock());
 *
 * // YourComponent.test.tsx. Override per test
 * import { useImagesQuery } from "@/hooks/useImages";
 * import { mockImagesLoaded, makePendingImagesForEvent } from "@test-config";
 *
 * vi.mocked(useImagesQuery).mockReturnValue(
 *   mockImagesLoaded(makePendingImagesForEvent("event-1"))
 * );
 */
export const imageHooksMock = () => ({
  imagesKeys: {
    all: ["images"],
    event: (eventId?: string) => ["images", eventId],
    uploaded: (eventId?: string) => ["images", eventId, "uploaded"],
  },
  useImagesQuery: vi.fn(() => ({ ...defaultImagesQueryReturn })),
  useMyImagesQuery: vi.fn(() => ({ ...defaultMyImagesQueryReturn })),
  useUploadedImageCountQuery: vi.fn(() => ({ ...defaultUploadedImageCountQueryReturn })),
  useUploadImageMutation: vi.fn(() => ({ ...defaultUploadImageMutationReturn })),
  useUpdateImageMutation: vi.fn(() => ({ ...defaultUpdateImageMutationReturn })),
  useBatchUpdateImageMutation: vi.fn(() => ({
    ...defaultBatchUpdateImageMutationReturn,
  })),
  useDeleteImageMutation: vi.fn(() => ({ ...defaultDeleteImageMutationReturn })),
});
