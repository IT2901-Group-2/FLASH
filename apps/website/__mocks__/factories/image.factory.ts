import type { Image } from "@/db";

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
