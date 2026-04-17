import type { Image } from "@/db";
import {
  BatchUpdateImageInput,
  CreateImageInput,
  DeleteImageInput,
  UpdateImageInput,
} from "@/hooks/useImages";

let _counter = 1;
const nextId = () => `image-${_counter++}`;

/**
 * Creates a fully-populated Image. Any field can be overridden.
 *
 * @example
 * const image = makeImage({ eventId: "event-1", isApproved: true });
 */
export const makeImage = (overrides: Partial<Image> = {}): Image => {
  return {
    id: nextId(),
    eventId: "event-123",
    userId: "user-123",
    isApproved: null,
    previewImage:
      "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAABQBQCdASogACAAPm00lUgkIyIhKAgAgA2JaQAA7MJS5IHjB4zLDA3J/kcpw0UNvpizMgAA/v1gU0XW/gLycFAkFtvekNcR3uBZWSxKpCS/DRKoYDyfFd4K1aODamUYMds9wossRPwW7bY0CxN7V+npngAAAA==",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Creates a list of Images, all belonging to the same event.
 *
 * @example
 * const images = makeImages(3, { eventId: "event-1" });
 */
export const makeImages = (count: number, overrides: Partial<Image> = {}): Image[] => {
  return Array.from({ length: count }, () => makeImage(overrides));
};

/**
 * Creates a mock response for the uploaded image count endpoint.
 *
 * @example
 * const response = makeUploadedImageCount(10); // { count: 10 }
 */
export const makeUploadedImageCount = (count: number = 10) => ({ count });

/**
 * Creates a mock File object suitable for upload tests.
 *
 * @example
 * const file = makeMockFile("photo.jpg", "image/jpeg");
 */
export const makeMockFile = (
  name = "test-photo.jpg",
  type = "image/jpeg",
  content = "mock file content"
): File => {
  return new File([content], name, { type });
};

/**
 * Creates a mock FileList containing a single file.
 * Useful for simulating file input events.
 */
export const makeMockFileList = (file: File): FileList => {
  return {
    0: file,
    length: 1,
    item: (index: number) => (index === 0 ? file : null),
    [Symbol.iterator]: function* () {
      yield file;
    },
  } as FileList;
};

/**
 * Resets the internal ID counter.
 * Call in beforeEach if ID stability matters.
 */
export const resetImageCounter = () => {
  _counter = 1;
};

/**
 * Factory functions for creating input objects for image mutations.
 *
 * @example
 * const input = makeCreateImageInput({ eventId: "event-1" });
 */
export const makeCreateImageInput = (
  overrides: Partial<CreateImageInput> = {}
): CreateImageInput => {
  return {
    eventId: "event-123",
    file: makeMockFile(),
    ...overrides,
  };
};

/**
 * Factory functions for creating input objects for image mutations.
 *
 * @example
 * const input = makeUpdateImageInput({ eventId: "event-1", imageId: "image-1", data: { isApproved: true } });
 */
export const makeUpdateImageInput = (
  overrides: Partial<UpdateImageInput> = {}
): UpdateImageInput => {
  return {
    eventId: "event-123",
    imageId: "image-123",
    data: {
      isApproved: true,
    },
    ...overrides,
  };
};

/**
 * Factory functions for creating input objects for image mutations.
 *
 * @example
 * const input = makeDeleteImageInput({ eventId: "event-1", imageId: "image-1" });
 */
export const makeDeleteImageInput = (
  overrides: Partial<DeleteImageInput> = {}
): DeleteImageInput => {
  return {
    eventId: "event-123",
    imageId: "image-123",
    ...overrides,
  };
};

/**
 * Factory functions for creating input objects for batch image update mutations.
 *
 * @example
 * const input = makeBatchUpdateImageInput({ eventId: "event-1", ids: ["image-1", "image-2"], isApproved: false });
 */
export const makeBatchUpdateImageInput = (
  overrides: Partial<BatchUpdateImageInput> = {}
): BatchUpdateImageInput => {
  return {
    eventId: "event-123",
    ids: ["image-1", "image-2", "image-3"],
    isApproved: true,
    ...overrides,
  };
};
