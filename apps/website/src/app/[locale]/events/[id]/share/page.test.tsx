import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, cleanup, fireEvent, act, render } from "@testing-library/react";
import Page from "./page";
import * as downloadQrCodeModule from "@/utils/downloadqrcode";

describe("Share Event Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all components together", () => {
    const { container } = render(<Page />);
    const pageWrapper = container.querySelector('[class*="pageWrapper"]');

    expect(pageWrapper).not.toBeNull();
    expect(pageWrapper).toBeTruthy();
  });

  it("displays translated content", () => {
    render(<Page />);

    expect(screen.getByText("variants.eventCreated.title")).toBeTruthy();
    expect(screen.getByText("variants.eventCreated.description")).toBeTruthy();
  });

  it("renders all required components", () => {
    render(<Page />);

    expect(screen.getByRole("radio", { name: "roles.guest" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "roles.moderator" })).toBeTruthy();
    expect(screen.getByText("links.guest.title")).toBeTruthy();
    expect(screen.getByRole("button", { name: "actions.downloadQrCode" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "actions.done" })).toBeTruthy();
  });

  it("copies link and briefly shows copied state", async () => {
    vi.useFakeTimers();
    try {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(window.navigator, "clipboard", {
        value: { writeText },
        configurable: true,
      });

      const { container } = render(<Page />);

      const copyIcon = container.querySelector('svg[aria-label="aria.copyLinkButton"]');
      expect(copyIcon).toBeTruthy();

      fireEvent.click(copyIcon!);

      await act(async () => {
        await Promise.resolve();
      });

      expect(writeText).toHaveBeenCalledTimes(1);
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/event/abc123/guest`
      );
      expect(
        container.querySelector('svg[aria-label="aria.copyLinkButton"]')
      ).toBeFalsy();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1200);
      });

      expect(
        container.querySelector('svg[aria-label="aria.copyLinkButton"]')
      ).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  it("downloads QR svg when clicking download button", () => {
    const downloadSpy = vi
      .spyOn(downloadQrCodeModule, "downloadQrSvg")
      .mockImplementation(() => undefined);

    render(<Page />);

    fireEvent.click(screen.getByRole("button", { name: "actions.downloadQrCode" }));

    expect(downloadSpy).toHaveBeenCalledWith(expect.any(SVGElement), "qr-abc123-g.svg");

    downloadSpy.mockRestore();
  });
});
