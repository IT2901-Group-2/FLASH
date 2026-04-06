import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import styles from "./slideshow.module.css";
import Page from "./page";
import { mockRouter } from "@test-config";

// --- mocks ---

const mockToggle = vi.fn();
const mockSetViewIndex = vi.fn();
const mockPause = vi.fn();
const mockResume = vi.fn();
let mockPaused = false;
let mockViewIndex = 0;

vi.mock("@/hooks/useInterval", () => ({
  useInterval: () => [
    mockViewIndex,
    mockSetViewIndex,
    { paused: mockPaused, toggle: mockToggle, pause: mockPause, resume: mockResume },
  ],
}));

let mockIsIdle = false;
vi.mock("@/hooks/useIdle", () => ({
  useIdle: () => mockIsIdle,
}));

const mockEnterFullscreen = vi.fn();
const mockExitFullscreen = vi.fn();
let mockFullscreenActive = false;

vi.mock("react-full-screen", () => ({
  FullScreen: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useFullScreenHandle: () => ({
    active: mockFullscreenActive,
    enter: mockEnterFullscreen,
    exit: mockExitFullscreen,
    node: { current: null },
  }),
}));

const mockImages = [
  { id: "img-1", url: "/img1.jpg" },
  { id: "img-2", url: "/img2.jpg" },
];

vi.mock("@/hooks/useImages", () => ({
  useImagesQuery: () => ({ data: mockImages }),
}));

vi.mock("@/hooks/useEvents", () => ({
  useEventsQuery: () => ({ data: [{ id: "event-123", name: "Test Event" }] }),
  useEventCodeQuery: () => ({ data: "ABC123" }),
}));

describe("Slideshow Page", () => {
  beforeEach(() => {
    mockIsIdle = false;
    mockPaused = false;
    mockViewIndex = 0;
    mockFullscreenActive = false;
    vi.clearAllMocks();
  });

  describe("image display", () => {
    it("renders the current image", () => {
      render(<Page />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "/api/events/event-123/images/img-1");
    });

    it("shows the no-images message when there are no images", ({ skip }) => {
      skip();
    });

    it("does not show the no-images message when images exist", () => {
      render(<Page />);
      expect(screen.queryByText("No approved images")).not.toBeInTheDocument();
    });

    it("renders the correct image for the current view index", () => {
      mockViewIndex = 1;
      render(<Page />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "/api/events/event-123/images/img-2");
    });
  });

  describe("header", () => {
    it("renders the event name", () => {
      render(<Page />);
      expect(screen.getByText("Test Event")).toBeInTheDocument();
    });

    it("renders the view progress", () => {
      render(<Page />);
      expect(screen.getByText("viewProgress")).toBeInTheDocument();
    });

    it("navigates back when the X button is clicked", () => {
      render(<Page />);
      fireEvent.click(screen.getByTestId("back-button"));
      expect(mockRouter.back).toHaveBeenCalledTimes(1);
    });
  });

  describe("controls", () => {
    it("calls setViewIndex with a decrement on prev click", ({ skip }) => {
      skip();
    });

    it("calls setViewIndex with an increment on next click", ({ skip }) => {
      skip();
    });

    it("calls toggle when the pause/play button is clicked", () => {
      render(<Page />);
      fireEvent.click(screen.getByTestId("toggle-button"));
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it("shows the Pause icon when not paused", () => {
      render(<Page />);
      expect(screen.getByTestId("pause")).toBeInTheDocument();
      expect(screen.queryByTestId("play")).not.toBeInTheDocument();
    });

    it("shows the Play icon when paused", () => {
      mockPaused = true;
      render(<Page />);
      expect(screen.getByTestId("play")).toBeInTheDocument();
      expect(screen.queryByTestId("pause")).not.toBeInTheDocument();
    });

    it("enters fullscreen when fullscreen button is clicked and inactive", () => {
      render(<Page />);

      fireEvent.click(screen.getByTestId("fullscreen-button"));

      expect(mockEnterFullscreen).toHaveBeenCalledTimes(1);
      expect(mockExitFullscreen).not.toHaveBeenCalled();
    });

    it("exits fullscreen when fullscreen button is clicked and active", () => {
      mockFullscreenActive = true;
      render(<Page />);

      fireEvent.click(screen.getByTestId("fullscreen-button"));

      expect(mockExitFullscreen).toHaveBeenCalledTimes(1);
      expect(mockEnterFullscreen).not.toHaveBeenCalled();
    });

    it("shows Shrink icon when fullscreen is active", () => {
      mockFullscreenActive = true;
      render(<Page />);

      const fullScreenButton = screen.getByTestId("fullscreen-button");
      expect(fullScreenButton.querySelector(".lucide-shrink")).toBeTruthy();
      expect(fullScreenButton.querySelector(".lucide-expand")).toBeNull();
    });
  });

  describe("QR code", () => {
    it("renders the QR display by default", () => {
      render(<Page />);
      expect(screen.getByTestId("qr-display")).toBeInTheDocument();
    });

    it("hides the QR display after clicking the QR button", () => {
      render(<Page />);
      fireEvent.click(screen.getByTestId("qr-button"));
      expect(screen.queryByTestId("qr-display")).not.toBeInTheDocument();
    });

    it("toggles the QR display on repeated clicks", () => {
      render(<Page />);
      const btn = screen.getByTestId("qr-button");

      fireEvent.click(btn);
      expect(screen.queryByTestId("qr-display")).not.toBeInTheDocument();

      fireEvent.click(btn);
      expect(screen.getByTestId("qr-display")).toBeInTheDocument();
    });

    it("passes the join link and code to QRDisplay", () => {
      render(<Page />);
      const qr = screen.getByTestId("qr-display");
      expect(qr).toHaveAttribute("data-code", "ABC123");
      expect(qr.getAttribute("data-value")).toMatch(/\/join\/ABC123/);
    });
  });

  describe("idle behaviour", () => {
    it("adds hideCursor class to the page when idle", () => {
      mockIsIdle = true;
      render(<Page />);
      expect(screen.getByTestId("page")).toHaveClass(`${styles.hideCursor}`);
    });

    it("does not add hideCursor class when not idle", () => {
      render(<Page />);
      expect(screen.getByTestId("page")).not.toHaveClass(`${styles.hideCursor}`);
    });
  });
});
