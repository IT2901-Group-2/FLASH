import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Page from "./page";

// Track which translation keys are requested
const translationKeys: string[] = [];

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => {
    return (key: string) => {
      translationKeys.push(key);
      const translations: Record<string, string> = {
        appTitle: "PhotoEvent",
        appDescription: "Join and share photos from events",
      };
      return translations[key] || key;
    };
  },
}));

// Mock the Logo component
vi.mock("@/components/Logo/Logo", () => ({
  default: () => <div data-testid="logo">Logo</div>,
}));

// Mock the JoinEventCard component
vi.mock("@/components/JoinEvent/JoinEventCard", () => ({
  default: () => <div data-testid="join-event-card">Join Event Card</div>,
}));

describe("Page", () => {
  afterEach(() => {
    cleanup();
    translationKeys.length = 0; // Clear translation keys after each test
  });

  test("renders the Logo component", () => {
    render(<Page />);
    const logo = screen.getByTestId("logo");
    expect(logo).toBeDefined();
  });

  test("renders the JoinEventCard component", () => {
    render(<Page />);
    const joinEventCard = screen.getByTestId("join-event-card");
    expect(joinEventCard).toBeDefined();
  });

  test("renders all main components together", () => {
    render(<Page />);

    // Verify both Logo and JoinEventCard are present
    expect(screen.getByTestId("logo")).toBeDefined();
    expect(screen.getByTestId("join-event-card")).toBeDefined();
  });

  test("uses correct translation keys", () => {
    render(<Page />);

    // Verify that the component requests the correct translation keys
    expect(translationKeys).toContain("appTitle");
    expect(translationKeys).toContain("appDescription");
  });

  test("displays translated content", () => {
    render(<Page />);

    // Verify the translated text appears in the document
    expect(screen.getByText("PhotoEvent")).toBeDefined();
    expect(screen.getByText("Join and share photos from events")).toBeDefined();
  });
});
