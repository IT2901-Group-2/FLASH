import { vi } from "vitest";
import { defaultFileUploadReturn } from "../hooks/useFileUpload.mock";

/**
 * Drop-in `vi.mock()` factory for `@/hooks/useFileUpload`.
 *
 * @example
 * // vitest.setup.tsx — register once globally
 * vi.mock("@/hooks/useFileUpload", () => fileUploadHookMock());
 *
 * // YourComponent.test.tsx — override per test
 * import { useFileUpload } from "@/hooks/useFileUpload";
 * import { mockFileUploadReady } from "@test-config";
 *
 * vi.mocked(useFileUpload).mockReturnValue(mockFileUploadReady());
 */
export const fileUploadHookMock = () => ({
  useFileUpload: vi.fn(() => ({ ...defaultFileUploadReturn })),
});
