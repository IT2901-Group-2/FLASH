/**
 * Auto-mock for next/navigation.
 *
 * When a test calls `vi.mock("next/navigation")` with no factory, Vitest
 * resolves this file. The mockRouter is shared, so tests can import it
 * directly to assert on navigation calls:
 *
 *   import { mockRouter } from "@test-config";
 *   expect(mockRouter.back).toHaveBeenCalledTimes(1);
 *
 * Call resetMockRouter() in beforeEach to clear call history.
 */
import { vi } from "vitest";
import { mockRouter } from "../router.mock";

export const useRouter = vi.fn(() => mockRouter);
export const usePathname = vi.fn(() => "/");
export const useSearchParams = vi.fn(() => new URLSearchParams());
export const useParams = vi.fn(() => ({ id: "event-123" }));
export const redirect = vi.fn();
export const notFound = vi.fn();
