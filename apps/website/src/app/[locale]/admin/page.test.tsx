import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, cleanup } from "@testing-library/react";
import Page from "./page";
import { renderWithQuery } from "@test-config";

vi.mock("@/components/ConfigButtons/LanguageToggleButton", () => ({
  default: () => <button data-testid="language-toggle-button">Language Toggle</button>,
}));

vi.mock("@/components/ConfigButtons/ThemeToggleButton", () => ({
  default: () => <button data-testid="theme-toggle-button">Theme Toggle</button>,
}));

vi.mock("@/components/SignInCard/SignInCard", () => ({
  default: () => <div data-testid="sign-in-card"></div>,
}));

describe("AdminLogin Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all components together", () => {
    const { container } = renderWithQuery(<Page />);
    const pageWrapper = container.querySelector('[class*="pageWrapper"]');

    expect(pageWrapper).not.toBeNull();
    expect(pageWrapper).toBeTruthy();
  });

  it("displays translated content", () => {
    renderWithQuery(<Page />);

    expect(screen.getByText("title")).toBeTruthy();
    expect(screen.getAllByText("description").length).toBeGreaterThan(0);
    expect(screen.getByText("subtitle")).toBeTruthy();
  });

  it("renders all required components", () => {
    renderWithQuery(<Page />);

    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getByTestId("sign-in-card")).toBeTruthy();
  });
});
