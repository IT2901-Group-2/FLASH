import { vi } from "vitest";
import type { useFileUpload } from "@/hooks/useFileUpload";

//* Return-type of is not its own type, so this is the best solution
type UseFileUploadReturn = ReturnType<typeof useFileUpload>;

export const defaultFileUploadReturn: UseFileUploadReturn = {
  openFilePicker: vi.fn(),
  FileInput: () => <div data-testid="file-upload" />,
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
  openFilePicker: vi.fn(),
  ...overrides,
});
