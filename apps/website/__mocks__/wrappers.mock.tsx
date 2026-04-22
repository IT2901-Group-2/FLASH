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

/**
 * Creates a wrapper that provides the next-intl context with a default locale.
 * Use this for components that use next-intl hooks but don't need to assert on
 * locale-specific behavior.
 *
 * @example
 * render(<MyComponent />, { wrapper: createNextIntlLanguageWrapper() });
 */
export const createNextIntlLanguageWrapper = () => {
  // There is a circular dependency between this file and the useLocale hook,
  // so it is needed to require it here instead of importing at the top level.

  // I don't like this, but the way next-intl is structured makes it hard to avoid.

  // It could be defined in the `useLanguage` test file, but it is felt wrong to
  // have it defined in a different place than `wrappers`.

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { NextIntlClientProvider } = require("next-intl");

  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={{}}>
      {children}
    </NextIntlClientProvider>
  );
  wrapper.displayName = "TestNextIntlWrapper";
  return wrapper;
};

/**
 * Renders a component wrapped in the next-intl context with a default locale.
 * Shorthand for components that use next-intl hooks but don't need to assert on
 *
 * @example
 * const { getByText } = renderWithNextIntl(<MyComponent />);
 */
export const renderWithNextIntl = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => {
  return render(ui, { wrapper: createNextIntlLanguageWrapper(), ...options });
};
