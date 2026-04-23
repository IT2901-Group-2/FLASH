import { describe, expect, it } from "vitest";
import { getUploadErrorMessageDescriptor } from "./fileUploadErrorMessages";

const fulfilled = (value: unknown = null): PromiseFulfilledResult<unknown> => ({
  status: "fulfilled",
  value,
});

const rejected = (reason: unknown): PromiseRejectedResult => ({
  status: "rejected",
  reason,
});

describe("getUploadErrorMessageDescriptor", () => {
  it("returns null when all uploads succeed", () => {
    const results: PromiseSettledResult<unknown>[] = [fulfilled(), fulfilled()];

    expect(getUploadErrorMessageDescriptor(results)).toBeNull();
  });

  it("returns upload limit message when a failure indicates limit was reached", () => {
    const results: PromiseSettledResult<unknown>[] = [
      fulfilled(),
      rejected(new Error("Upload limit reached for this event")),
    ];

    expect(getUploadErrorMessageDescriptor(results)).toEqual({
      key: "errors.uploadLimitReached",
    });
  });

  it("returns too large message when a failure indicates file size issue", () => {
    const results: PromiseSettledResult<unknown>[] = [
      rejected(new Error("Payload too large")),
    ];

    expect(getUploadErrorMessageDescriptor(results)).toEqual({
      key: "errors.uploadFailedTooLarge",
    });
  });

  it("returns unsupported format message when a failure indicates invalid image format", () => {
    const results: PromiseSettledResult<unknown>[] = [
      rejected(new Error("Unsupported image format")),
    ];

    expect(getUploadErrorMessageDescriptor(results)).toEqual({
      key: "errors.uploadFailedUnsupportedFormat",
    });
  });

  it("returns network message when a failure indicates network issues", () => {
    const results: PromiseSettledResult<unknown>[] = [
      rejected(new Error("Failed to fetch")),
    ];

    expect(getUploadErrorMessageDescriptor(results)).toEqual({
      key: "errors.uploadFailedNetwork",
    });
  });

  it("returns generic upload failed with number of failures when no known pattern matches", () => {
    const results: PromiseSettledResult<unknown>[] = [
      rejected(new Error("Something unexpected happened")),
      rejected("unknown rejection reason"),
      fulfilled(),
    ];

    expect(getUploadErrorMessageDescriptor(results)).toEqual({
      key: "errors.uploadFailed",
      values: { count: 2 },
    });
  });

  it("prioritizes messages according to priority when multiple errors occur", () => {
    const results: PromiseSettledResult<unknown>[] = [
      rejected(new Error("Failed to fetch")),
      rejected(new Error("Payload too large")),
    ];

    expect(getUploadErrorMessageDescriptor(results)).toEqual({
      key: "errors.uploadFailedTooLarge",
    });
  });
});
