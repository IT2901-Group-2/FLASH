import { qrScannerMock } from "@test-config";
import { render, screen } from "@testing-library/react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import QrScanner from "./QRScanner";

vi.mock("@yudiel/react-qr-scanner", () => qrScannerMock());

/**
 * Spy on navigator.mediaDevices.getUserMedia so we can assert the cleanup
 * effect calls it and stops every track on unmount.
 */
const mockTrackStop = vi.fn();
const mockGetUserMedia = vi.fn();

describe("QRScanner", () => {
  const onScan = vi.fn();
  const renderScanner = (props = {}) => render(<QrScanner onScan={onScan} {...props} />);

  beforeEach(() => {
    mockTrackStop.mockResolvedValue(undefined);
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: mockTrackStop }, { stop: mockTrackStop }],
    });

    Object.defineProperty(navigator, "mediaDevices", {
      value: { getUserMedia: mockGetUserMedia },
      writable: true,
      configurable: true,
    });
  });

  describe("rendering", () => {
    it("renders the Scanner and custom overlay", () => {
      renderScanner();
      expect(screen.getByTestId("qr-scanner")).toBeInTheDocument();

      expect(screen.getByTestId("qr-scanner")).toHaveAttribute("data-finder", "false");
      expect(screen.getByTestId("finder-overlay")).toBeInTheDocument();
    });

    it("has the correct attribues", () => {
      renderScanner();
      const scanner = screen.getByTestId("qr-scanner");

      expect(scanner).toHaveAttribute("data-sound", "/flash.wav");
      expect(scanner).toHaveAttribute("data-facing-mode", "environment");
    });

    it("forwards additional props to Scanner", () => {
      const onError = vi.fn();
      renderScanner({ onError });

      expect(vi.mocked(Scanner).mock.calls.at(-1)?.[0]).toMatchObject({ onError });
    });
  });

  describe("cleanup on unmount", () => {
    it("obtains the stream abd stops every track", async () => {
      const { unmount } = renderScanner();
      expect(mockTrackStop).not.toHaveBeenCalled();

      unmount();

      expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
      await vi.waitFor(() => expect(mockTrackStop).toHaveBeenCalledTimes(2));
    });
  });
});
