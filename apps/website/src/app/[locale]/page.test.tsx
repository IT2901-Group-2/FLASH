import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Page from "./page";
import { createQueryClientWrapper } from "@test-config";

// Track which translation keys are requested
const translationKeys: string[] = [];

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => {
    return (key: string) => {
      translationKeys.push(key);
      const translations: Record<string, string> = {
        name: "FLASH",
        description: "Join and share photos from events",
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

vi.mock("@/providers/JoinedEventsContext", () => ({
  useJoinedEvents: vi.fn(() => []),
}));

vi.mock("@/components/LanguageToggleButton/LanguageToggleButton", () => ({
  default: () => <div data-testid="language-toggle-button">Language Toggle</div>,
}));

describe("Page", () => {
  afterEach(() => {
    cleanup();
    translationKeys.length = 0; // Clear translation keys after each test
  });

  test("renders the Logo component", () => {
    render(<Page />, { wrapper: createQueryClientWrapper() });
    const logo = screen.getByTestId("logo");
    expect(logo).toBeDefined();
  });

  test("renders the JoinEventCard component", () => {
    render(<Page />, { wrapper: createQueryClientWrapper() });
    const joinEventCard = screen.getByTestId("join-event-card");
    expect(joinEventCard).toBeDefined();
  });

  test("renders all main components together", () => {
    render(<Page />, { wrapper: createQueryClientWrapper() });

    // Verify both Logo and JoinEventCard are present
    expect(screen.getByTestId("logo")).toBeDefined();
    expect(screen.getByTestId("join-event-card")).toBeDefined();
  });

  test("uses correct translation keys", () => {
    render(<Page />, { wrapper: createQueryClientWrapper() });

    // Verify that the component requests the correct translation keys
    expect(translationKeys).toContain("name");
    expect(translationKeys).toContain("description");
  });

  test("displays translated content", () => {
    render(<Page />, { wrapper: createQueryClientWrapper() });

    // Verify the translated text appears in the document
    expect(screen.getByText("FLASH")).toBeDefined();
    expect(screen.getByText("Join and share photos from events")).toBeDefined();
  });
});
