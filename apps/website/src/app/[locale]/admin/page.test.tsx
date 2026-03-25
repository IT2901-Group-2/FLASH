import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Page from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/components/ConfigButtons/LanguageToggleButton", () => ({
  default: () => <div data-testid="language-toggle-button">Language Toggle</div>,
}));

vi.mock("@/components/ConfigButtons/ThemeToggleButton", () => ({
  default: () => <div data-testid="theme-toggle-button">Theme Toggle</div>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestQueryWrapper";
  return Wrapper;
};

describe("AdminLogin Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all components together", () => {
    const { container } = render(<Page />, { wrapper: createWrapper() });
    const pageWrapper = container.querySelector('[class*="pageWrapper"]');

    expect(pageWrapper).not.toBeNull();
    expect(pageWrapper).toBeTruthy();
  });

  it("displays translated content", () => {
    render(<Page />, { wrapper: createWrapper() });

    expect(screen.getByText("title")).toBeTruthy();
    expect(screen.getAllByText("description").length).toBeGreaterThan(0);
    expect(screen.getByText("subtitle")).toBeTruthy();
  });

  it("renders all required components", () => {
    const { container } = render(<Page />, { wrapper: createWrapper() });

    expect(screen.getByTestId("title")).toBeTruthy();
    const signInCard = container.querySelector('[class*="card"]');
    expect(signInCard).toBeTruthy();
  });
});
