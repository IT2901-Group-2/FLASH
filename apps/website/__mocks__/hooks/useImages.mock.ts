import { vi } from "vitest";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Image } from "@/db";
import { makeImage, makeImages } from "../factories/image.factory";
import type {
  UpdateImageInput,
  BatchUpdateImageInput,
  CreateImageInput,
} from "../factories/image.factory";

// ---------------------------------------------------------------------------
// Default return values
// ---------------------------------------------------------------------------

export const defaultImagesQueryReturn = {
  data: undefined as Image[] | undefined,
  isLoading: false,
  isError: false,
} as UseQueryResult<Image[]>;

export const defaultUploadImageMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(makeImage()),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<Image, Error, CreateImageInput>;

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

export const defaultBatchUpdateImageMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<void, Error, BatchUpdateImageInput>;

export const defaultDeleteImageMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  mutate: vi.fn(),
  status: "idle",
  isPending: false,
  isSuccess: false,
  isError: false,
  reset: vi.fn(),
} as unknown as UseMutationResult<void, Error, { eventId: string; imageId: string }>;

/**
 * Creates a mock return value for useImagesQuery with pre-loaded images.
 *
 * @example
 * vi.mocked(useImagesQuery).mockReturnValue(
 *   mockImagesLoaded([makeImage({ eventId: "event-1", isApproved: null })])
 * );
 */
export function mockImagesLoaded(images: Image[]): UseQueryResult<Image[]> {
  return {
    data: images,
    isLoading: false,
    isError: false,
  } as UseQueryResult<Image[]>;
}

export function mockImagesLoading(): UseQueryResult<Image[]> {
  return {
    data: undefined,
    isLoading: true,
    isError: false,
  } as UseQueryResult<Image[]>;
}

export function mockImagesError(
  error = new Error("Failed to load images")
): UseQueryResult<Image[]> {
  return {
    data: undefined,
    isLoading: false,
    isError: true,
    error,
  } as unknown as UseQueryResult<Image[]>;
}

/**
 * Creates 3 pending images for the default moderation test setup.
 * Mirrors the most common beforeEach pattern seen across tests.
 */
export function makePendingImagesForEvent(eventId = "event-1", count = 3): Image[] {
  return makeImages(count, { eventId, isApproved: null });
}
