import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { type ReactNode } from "react";

/**
 * Creates a fresh QueryClient + wrapper component for each test.
 * Always creates a new QueryClient to avoid state bleed between tests.
 *
 * @example
 * // With render options
 * render(<MyComponent />, { wrapper: createQueryClientWrapper() });
 *
 * // With renderHook
 * const { result } = renderHook(() => useMyHook(), {
 *   wrapper: createQueryClientWrapper(),
 * });
 */
export const createQueryClientWrapper = () => createQueryClientWithWrapper().wrapper;

/**
 * Creates a QueryClient + wrapper and exposes the queryClient directly.
 * Use this when you need to spy on invalidateQueries, setQueryData, etc.
 *
 * @example
 * const { wrapper, queryClient } = createQueryClientWithWrapper();
 * const spy = vi.spyOn(queryClient, "invalidateQueries");
 * const { result } = renderHook(() => useMyMutation(), { wrapper });
 */
export const createQueryClientWithWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  wrapper.displayName = "TestQueryClientWrapper";

  return { wrapper, queryClient };
};

/**
 * Renders a component wrapped in a QueryClientProvider.
 * Shorthand for components that always need the query context.
 *
 * @example
 * const { getByText } = renderWithQuery(<MyPage />);
 */
export const renderWithQuery = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => {
  return render(ui, { wrapper: createQueryClientWrapper(), ...options });
};
