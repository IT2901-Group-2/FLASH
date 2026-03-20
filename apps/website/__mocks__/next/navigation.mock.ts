import { vi } from "vitest";
import { mockRouter } from "../router.mock";

export const useRouter = vi.fn(() => mockRouter);
export const usePathname = vi.fn(() => "/");
export const useSearchParams = vi.fn(() => new URLSearchParams());
export const useParams = vi.fn(() => ({ id: "event-123" }));
export const redirect = vi.fn();
export const notFound = vi.fn();
