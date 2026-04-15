import { eventHooksMock, renderWithQuery } from "@test-config";
import { describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import Page from "./page";

vi.mock("@/hooks/useEvents", () => eventHooksMock());

vi.mock("@/components/Logo/Logo", () => ({
  default: () => <div data-testid="logo">Logo</div>,
}));
vi.mock("@/components/JoinEvent/JoinEventCard", () => ({
  default: () => <div data-testid="join-event-card">Join Event Card</div>,
}));
vi.mock("@/components/ConfigButtons/LanguageToggleButton", () => ({
  default: () => <div data-testid="language-toggle-button">Language Toggle</div>,
}));
vi.mock("@/components/ConfigButtons/ThemeToggleButton", () => ({
  default: () => <div data-testid="theme-toggle-button">Theme Toggle</div>,
}));

describe("Page", () => {
  test("renders the Logo component", () => {
    renderWithQuery(<Page />);
    const logo = screen.getByTestId("logo");
    expect(logo).toBeDefined();
  });

  test("renders the JoinEventCard component", () => {
    renderWithQuery(<Page />);
    const joinEventCard = screen.getByTestId("join-event-card");
    expect(joinEventCard).toBeDefined();
  });

  test("renders all main components together", () => {
    renderWithQuery(<Page />);

    // Verify both Logo and JoinEventCard are present
    expect(screen.getByTestId("logo")).toBeDefined();
    expect(screen.getByTestId("join-event-card")).toBeDefined();
  });

  test("displays translated content", () => {
    renderWithQuery(<Page />);

    // Verify the translated text appears in the document
    expect(screen.getByText("name")).toBeDefined();
    expect(screen.getByText("description")).toBeDefined();
  });
});
