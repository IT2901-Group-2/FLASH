import type { Image } from "@/db";

let _counter = 1;
const nextId = () => `image-${_counter++}`;

export type CreateImageInput = {
  eventId: string;
  file: File;
};

export type UpdateImageInput = {
  isApproved: boolean | null;
};

export type BatchUpdateImageInput = {
  eventId: string;
  ids: string[];
  isApproved: boolean;
};

/**
 * Creates a fully-populated Image. Any field can be overridden.
 *
 * @example
 * const image = makeImage({ eventId: "event-1", isApproved: true });
 */
export function makeImage(overrides: Partial<Image> = {}): Image {
  return {
    id: nextId(),
    eventId: "event-123",
    userId: "user-123",
    isApproved: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

/**
 * Creates a list of Images, all belonging to the same event.
 *
 * @example
 * const images = makeImages(3, { eventId: "event-1" });
 */
export function makeImages(count: number, overrides: Partial<Image> = {}): Image[] {
  return Array.from({ length: count }, () => makeImage(overrides));
}

/**
 * Creates a mock File object suitable for upload tests.
 *
 * @example
 * const file = makeMockFile("photo.jpg", "image/jpeg");
 */
export function makeMockFile(
  name = "test-photo.jpg",
  type = "image/jpeg",
  content = "mock file content"
): File {
  return new File([content], name, { type });
}

/**
 * Creates a mock FileList containing a single file.
 * Useful for simulating file input events.
 */
export function makeMockFileList(file: File): FileList {
  return {
    0: file,
    length: 1,
    item: (index: number) => (index === 0 ? file : null),
    [Symbol.iterator]: function* () {
      yield file;
    },
  } as FileList;
}

/** Resets the internal ID counter — call in beforeEach if ID stability matters. */
export function resetImageCounter() {
  _counter = 1;
}
