import { mockRouter, qrScannerMock } from "@test-config";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import JoinEventCard from "./JoinEventCard";
import userEvent from "@testing-library/user-event";
import { IScannerProps, Scanner } from "@yudiel/react-qr-scanner";
import { makeRequest } from "@/lib/utils/api";

vi.mock("@yudiel/react-qr-scanner", () => qrScannerMock());
vi.mock("../QRScanner/QRScanner", () => ({
  default: ({ ...props }: IScannerProps) => <Scanner {...props} />,
}));
vi.mock("@/lib/utils/api", () => ({
  makeRequest: vi.fn(),
}));

const switchToScanTab = async () =>
  await userEvent.click(screen.getByText("tabs.scanQr"));
const openCamera = async () =>
  await userEvent.click(screen.getByRole("button", { name: "actions.toggleCamera" }));
const triggerScan = (rawValue: string) =>
  vi.mocked(Scanner).mock.calls.at(-1)![0].onScan!([
    { rawValue, format: "qr_code" } as never,
  ]);

describe("JoinEventCard", () => {
  beforeEach(() => {
    vi.mocked(makeRequest).mockResolvedValue(Promise.resolve(undefined));
    vi.stubGlobal("location", { origin: "http://localhost" });
  });

  describe("rendering", () => {
    it("renders the page title and link", () => {
      render(<JoinEventCard />);

      expect(screen.getByText("title")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "roles.admin" })).toHaveAttribute(
        "href",
        "/admin"
      );
    });

    it("shows the enter-code form by default", () => {
      render(<JoinEventCard />);

      expect(screen.getByRole("button", { name: "actions.join" })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "actions.toggleCamera" })
      ).not.toBeInTheDocument();
    });
  });

  describe("enter code tab", () => {
    it("navigates to /join/{code} on successful submission", async () => {
      render(<JoinEventCard />);
      await userEvent.type(screen.getByTestId("text-field"), "ABC123");
      await userEvent.click(screen.getByRole("button", { name: "actions.join" }));

      expect(mockRouter.push).toHaveBeenCalledWith("/join/ABC123");
      expect(makeRequest).toHaveBeenCalledWith(
        expect.anything(),
        "/api/events/by-code/ABC123"
      );
    });

    it("shows an error when the API rejects", async () => {
      vi.mocked(makeRequest).mockRejectedValue(new Error("not found"));

      render(<JoinEventCard />);
      await userEvent.type(screen.getByTestId("text-field"), "BADCODE");
      await userEvent.click(screen.getByRole("button", { name: "actions.join" }));

      expect(screen.getByText("errors.invalidEventCode")).toBeInTheDocument();
    });

    it("clears the error when the user types in the code field", async () => {
      vi.mocked(makeRequest).mockRejectedValue(new Error("not found"));

      render(<JoinEventCard />);
      await userEvent.type(screen.getByTestId("text-field"), "BAD");
      await userEvent.click(screen.getByRole("button", { name: "actions.join" }));

      expect(screen.getByText("errors.invalidEventCode")).toBeInTheDocument();
      await userEvent.type(screen.getByTestId("text-field"), "X");
      expect(screen.queryByText("errors.invalidEventCode")).not.toBeInTheDocument();
    });
  });

  describe("scan QR tab", () => {
    describe("before camera is opened", () => {
      beforeEach(async () => {
        render(<JoinEventCard />);
        await switchToScanTab();
      });

      it("renders the toggle camera button", async () => {
        expect(
          screen.getByRole("button", { name: "actions.toggleCamera" })
        ).toBeInTheDocument();
        expect(screen.queryByTestId("qr-scanner")).not.toBeInTheDocument();
      });

      it("shows the scanner after clicking toggle camera", async () => {
        await openCamera();
        expect(screen.getByTestId("qr-scanner")).toBeInTheDocument();
      });

      it("hides the scanner again after a second toggle", async () => {
        await openCamera();
        await openCamera();

        expect(screen.queryByTestId("qr-scanner")).not.toBeInTheDocument();
      });
    });

    describe("when the camera is open", () => {
      beforeEach(async () => {
        render(<JoinEventCard />);
        await switchToScanTab();
        await openCamera();
      });

      it("navigates to /join/{code} on a valid scan", async () => {
        triggerScan("http://localhost/join/EVT999");
        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith("/join/EVT999");
        });
      });

      it("calls makeRequest with the correct path on a valid scan", async () => {
        triggerScan("http://localhost/join/EVT999");

        expect(makeRequest).toHaveBeenCalledWith(
          expect.anything(),
          "/api/events/by-code/EVT999"
        );
      });

      it("shows invalidQr error when the scanned URL has the wrong origin", async () => {
        triggerScan("https://evil.com/join/EVT999");
        await waitFor(() => {
          expect(screen.getByText("errors.invalidQr")).toBeInTheDocument();
        });
      });

      it("does not call makeRequest for a wrong-origin QR code", async () => {
        triggerScan("https://evil.com/join/EVT999");
        await waitFor(() => {
          expect(screen.getByText("errors.invalidQr")).toBeInTheDocument();
          expect(makeRequest).not.toHaveBeenCalled();
        });
      });

      it("shows invalidEventCode error when the API rejects a valid QR scan", async () => {
        vi.mocked(makeRequest).mockRejectedValue(new Error("not found"));
        triggerScan("http://localhost/join/GONE");
        await waitFor(() => {
          expect(screen.getByText("errors.invalidEventCode")).toBeInTheDocument();
        });
      });
    });
  });

  describe("tab switching", () => {
    it("clears an existing error when switching tabs", async () => {
      vi.mocked(makeRequest).mockRejectedValue(new Error("not found"));

      render(<JoinEventCard />);
      await userEvent.type(screen.getByTestId("text-field"), "BAD");
      await userEvent.click(screen.getByRole("button", { name: "actions.join" }));

      expect(screen.getByText("errors.invalidEventCode")).toBeInTheDocument();
      await switchToScanTab();
      expect(screen.queryByText("errors.invalidEventCode")).not.toBeInTheDocument();
    });

    it("closes the camera when switching tabs while scanning", async () => {
      render(<JoinEventCard />);

      await switchToScanTab();
      await openCamera();
      expect(screen.getByTestId("qr-scanner")).toBeInTheDocument();

      await userEvent.click(screen.getByText("tabs.enterCode"));

      await switchToScanTab();
      expect(screen.queryByTestId("qr-scanner")).not.toBeInTheDocument();
    });
  });
});
