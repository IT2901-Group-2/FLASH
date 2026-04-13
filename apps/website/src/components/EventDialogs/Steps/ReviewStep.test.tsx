import { eventHooksMock, makeEvent } from "@test-config";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ReviewStep from "./ReviewStep";
import type { Event } from "@/db";
import { useEventCodeQuery } from "@/hooks/useEvents";
import { downloadQrSvg } from "@/utils/downloadqrcode";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useEvents", () => eventHooksMock());
vi.mock("@/utils/downloadqrcode", () => ({
  downloadQrSvg: vi.fn(),
}));

const MOCK_EVENT = makeEvent();
const MOCK_CODE = "ABC123";
const MOCK_ORIGIN = "https://flash.example.com";

function setupQueryMock(code = MOCK_CODE) {
  vi.mocked(useEventCodeQuery).mockReturnValue({
    data: code,
  } as unknown as ReturnType<typeof useEventCodeQuery>);
}

function renderReview(
  status: "idle" | "pending" | "success" | "error" = "success",
  result: Event | null = MOCK_EVENT
) {
  return render(<ReviewStep status={status} result={result} />);
}

describe("ReviewStep", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { origin: MOCK_ORIGIN });
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  describe("pending state", () => {
    it("does not render the QR display while pending", () => {
      setupQueryMock();
      renderReview("pending");
      expect(screen.queryByTestId("QRDisplay")).not.toBeInTheDocument();
    });
  });

  describe("success state", () => {
    it("renders the title and description", () => {
      setupQueryMock();
      renderReview();
      expect(screen.getByText("title")).toBeInTheDocument();
      expect(screen.getByText("description")).toBeInTheDocument();
    });

    it("renders the QRDisplay with the correct link", () => {
      setupQueryMock();
      renderReview();
      const qr = screen.getByTestId("qr-display");
      expect(qr).toHaveAttribute("data-value", `${MOCK_ORIGIN}/join/${MOCK_CODE}`);
    });

    it("renders the read-only link TextField", () => {
      setupQueryMock();
      renderReview();
      const linkInput = screen.getByRole("textbox", { name: "Guest Link" });
      expect(linkInput).toHaveValue(`${MOCK_ORIGIN}/join/${MOCK_CODE}`);
      expect(linkInput).toHaveAttribute("readonly");
    });

    it("renders guest and moderator segmented tabs", () => {
      setupQueryMock();
      renderReview();
      expect(screen.getByText("Guest")).toBeInTheDocument();
      expect(screen.getByText("Moderator")).toBeInTheDocument();
    });
  });

  describe("role selector", () => {
    it("defaults to guest role", () => {
      setupQueryMock();
      renderReview();
      expect(useEventCodeQuery).toHaveBeenCalledWith(MOCK_EVENT.id, "guest");
    });

    it("switches to moderator when moderator tab is clicked", async () => {
      setupQueryMock();
      renderReview();

      const modButton = screen.getByText("Moderator");
      fireEvent.click(modButton);

      await waitFor(() => {
        expect(useEventCodeQuery).toHaveBeenCalledWith(MOCK_EVENT.id, "moderator");
      });
    });
  });

  describe("no result yet", () => {
    it("renders an empty link when result is null", () => {
      vi.mocked(useEventCodeQuery).mockReturnValue({
        data: undefined,
      } as unknown as ReturnType<typeof useEventCodeQuery>);

      renderReview("success", null);
      const linkInput = screen.getByRole("textbox", { name: "Guest Link" });
      expect(linkInput).toHaveValue("");
    });
  });

  describe("copy link", () => {
    it("calls clipboard.writeText with the display link", async () => {
      setupQueryMock();
      renderReview();

      await userEvent.click(screen.getByTestId("copy-button"));
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${MOCK_ORIGIN}/join/${MOCK_CODE}`
      );
    });
  });

  describe("download QR", () => {
    it("calls downloadQrSvg with the correct filename", async () => {
      setupQueryMock();
      renderReview();

      await userEvent.click(screen.getByText("actions.download"));

      expect(downloadQrSvg).toHaveBeenCalledWith(
        expect.any(SVGElement),
        `qr-${MOCK_CODE.toLowerCase()}.svg`
      );
    });
  });
});
