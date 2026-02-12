import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import JoinEventCard from "./JoinEventCard";

// Track which translation keys are requested
const translationKeys: string[] = [];

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => {
    return (key: string) => {
      translationKeys.push(key);
      const translations: Record<string, string> = {
        title: "Join Event",
        description: "Enter an event code or scan a QR code",
        eventCodeLabel: "Event Code",
        eventCodePlaceholder: "Enter code",
        joinButton: "Join",
        enterCodeTab: "Enter code",
        scanQrTab: "Scan QR",
        scanQrDescription: "Use your camera to scan the event QR code",
        openCameraButton: "Open Camera",
      };
      return translations[key] || key;
    };
  },
}));

describe("JoinEventCard", () => {
  afterEach(() => {
    cleanup();
    translationKeys.length = 0;
  });

  test("renders without crashing", () => {
    render(<JoinEventCard />);
    expect(screen.getByText("Join Event")).toBeDefined();
  });

  test("displays the correct title and description", () => {
    render(<JoinEventCard />);
    expect(screen.getByText("Join Event")).toBeDefined();
    expect(screen.getByText("Enter an event code or scan a QR code")).toBeDefined();
  });

  test("renders both tab options", () => {
    render(<JoinEventCard />);
    expect(screen.getByText("Enter code")).toBeDefined();
    expect(screen.getByText("Scan QR")).toBeDefined();
  });

  test("renders input field with correct label", () => {
    render(<JoinEventCard />);
    expect(screen.getByText("Event Code")).toBeDefined();
  });

  test("renders Join button", () => {
    render(<JoinEventCard />);
    expect(screen.getByText("Join")).toBeDefined();
  });

  test("uses correct translation keys", () => {
    render(<JoinEventCard />);
    
    // Verify all expected translation keys are requested
    expect(translationKeys).toContain("title");
    expect(translationKeys).toContain("description");
    expect(translationKeys).toContain("eventCodeLabel");
    expect(translationKeys).toContain("eventCodePlaceholder");
    expect(translationKeys).toContain("joinButton");
    expect(translationKeys).toContain("enterCodeTab");
    expect(translationKeys).toContain("scanQrTab");
    expect(translationKeys).toContain("scanQrDescription");
    expect(translationKeys).toContain("openCameraButton");
  });
});
