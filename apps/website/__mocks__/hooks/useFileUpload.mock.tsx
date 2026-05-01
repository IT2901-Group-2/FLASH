import { vi } from "vitest";
import type { UseFileUploadReturn } from "@/hooks/useFileUpload";

export const defaultFileUploadReturn: UseFileUploadReturn = {
  openFilePicker: vi.fn(),
  uploadFiles: vi.fn(),
  isSuccess: true,
  isError: false,
  error: null,
  isUploading: false,
  reset: vi.fn(),
  status: "success",
};

/**
 * Returns a mock result with a spy already set up on `openFilePicker`.
 * Useful when you need to assert the picker was triggered.
 *
 * @example
 * vi.mocked(useFileUpload).mockReturnValue(mockFileUploadReady());
 * await userEvent.click(screen.getByRole("button", { name: /upload/i }));
 * expect(vi.mocked(useFileUpload)().openFilePicker).toHaveBeenCalledOnce();
 */
export const mockFileUploadReady = (
  overrides: Partial<UseFileUploadReturn> = {}
): UseFileUploadReturn => ({
  ...defaultFileUploadReturn,
  ...overrides,
});

/**
 * Drop-in `vi.mock()` factory for `@/hooks/useFileUpload`.
 *
 * @example
 * // vitest.setup.tsx - register once globally
 * vi.mock("@/hooks/useFileUpload", () => fileUploadHookMock());
 *
 * // YourComponent.test.tsx - override per test
 * import { useFileUpload } from "@/hooks/useFileUpload";
 * import { mockFileUploadReady } from "@test-config";
 *
 * vi.mocked(useFileUpload).mockReturnValue(mockFileUploadReady());
 */
export const fileUploadHookMock = () => ({
  useFileUpload: vi.fn(() => ({ ...defaultFileUploadReturn })),
});
