/**
 * Utility functions for file upload error messages
 * If the file upload implementation on events/[id] is extracted into its own util,
 * this code should possibly be integrated there as well
 *
 * Upload error messages are currently prioritized as follows (Highest to lowest):
 *  1. Upload limit reached
 *  2. File too large
 *  3. Unsupported file format
 *  4. Network error
 */

const UPLOAD_ERROR_PATTERNS = [
  { key: "errors.uploadLimitReached", pattern: /upload\s+limit\s+reached/i },
  {
    key: "errors.uploadFailedTooLarge",
    pattern:
      /(input\s+image\s+exceeds\s+pixel\s+limit|file\s+too\s+large|function_payload_too_large|request\s+entity\s+too\s+large|payload\s+too\s+large)/i,
  },
  {
    key: "errors.uploadFailedUnsupportedFormat",
    pattern: /unsupported\s+image\s+format|invalid\s+image/i,
  },
  {
    key: "errors.uploadFailedNetwork",
    pattern: /failed\s+to\s+fetch|network\s*(error|request\s+failed)|fetch\s+failed/i,
  },
] as const;

type PatternErrorKey = (typeof UPLOAD_ERROR_PATTERNS)[number]["key"];

export type UploadErrorMessageDescriptor =
  | { key: "errors.uploadFailedTooLarge"; values: { maxFileSize: number } }
  | { key: Exclude<PatternErrorKey, "errors.uploadFailedTooLarge"> }
  | { key: "errors.uploadFailed"; values: { count: number } };

type UploadErrorMessageOptions = {
  maxFileSize: number;
};

/**
 * Checks if a PromiseSettledResult is a rejected promise with an error message that matches the given pattern.
 *
 * @param result - The PromiseSettledResult to check.
 * @param pattern - The RegExp pattern to match against the error message.
 * @returns A boolean indicating whether the result matches the pattern.
 */
const matchesRejectedError = (
  result: PromiseSettledResult<unknown>,
  pattern: RegExp
): boolean =>
  result.status === "rejected" &&
  result.reason instanceof Error &&
  pattern.test(result.reason.message);

/**
 * Analyzes an array of PromiseSettledResult objects from a file upload attempt and returns
 * an appropriate error message descriptor.
 *
 * - If any of the rejected results match known error patterns, the corresponding message key is returned.
 * - If there are rejected results but none match known patterns, a generic upload failed message
 * with the count of failures is returned.
 * - If there are no rejected results, null is returned (This resets any currently displayed error message).
 */
export const getUploadErrorMessageDescriptor = (
  results: PromiseSettledResult<unknown>[],
  options: UploadErrorMessageOptions
): UploadErrorMessageDescriptor | null => {
  const failures = results.filter(r => r.status === "rejected");

  if (failures.length === 0) return null;

  const matched = UPLOAD_ERROR_PATTERNS.find(({ pattern }) =>
    failures.some(result => matchesRejectedError(result, pattern))
  );

  if (!matched) {
    return { key: "errors.uploadFailed", values: { count: failures.length } };
  }

  if (matched.key === "errors.uploadFailedTooLarge") {
    return {
      key: matched.key,
      values: { maxFileSize: options.maxFileSize },
    };
  }

  return { key: matched.key };
};
