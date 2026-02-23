import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import JoinEventCard from "./JoinEventCard";

// Track which translation keys are requested
const translationKeys: string[] = [];
const mockPush = vi.fn();

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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    locale: "en",
  }),
}));

describe("JoinEventCard", () => {
  afterEach(() => {
    cleanup();
    translationKeys.length = 0;
    vi.unstubAllGlobals();
    mockPush.mockReset();
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

  test("shows validation error when event code is empty", async () => {
    render(<JoinEventCard />);

    fireEvent.click(screen.getByRole("button", { name: "Join" }));

    expect(await screen.findByText("Please enter an event code.")).toBeDefined();
  });

  test("calls API and routes to event page on successful lookup", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "ev-123" }],
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<JoinEventCard />);

    fireEvent.change(screen.getByLabelText("Event Code"), {
      target: { value: " ABC123 " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Join" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/events?guestCode=ABC123");
      expect(mockPush).toHaveBeenCalledWith("/en/ev-123");
    });
  });

  test("shows not-found error when lookup returns no events", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<JoinEventCard />);

    fireEvent.change(screen.getByLabelText("Event Code"), {
      target: { value: "MISSING" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Join" }));

    expect(await screen.findByText("No event found for that code.")).toBeDefined();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("shows generic error when request fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);

    render(<JoinEventCard />);

    fireEvent.change(screen.getByLabelText("Event Code"), {
      target: { value: "ABC123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Join" }));

    expect(
      await screen.findByText("Could not join event. Please try again.")
    ).toBeDefined();
  });

  test("submits when pressing Enter in the code field", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "ev-enter" }],
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<JoinEventCard />);

    fireEvent.change(screen.getByLabelText("Event Code"), {
      target: { value: "ENTER1" },
    });
    fireEvent.keyDown(screen.getByLabelText("Event Code"), { key: "Enter" });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/events?guestCode=ENTER1");
      expect(mockPush).toHaveBeenCalledWith("/en/ev-enter");
    });
  });
});
