import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import type { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import Page from "./page";

let fromParam: string | null = null;

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "from" ? fromParam : null),
  }),
}));

const messages = {
  ShareEventPage: {
    create: {
      firstTitle: "Your Event has been created!",
      firstDescription:
        "You can share the QR code or send them the link in order for others to join the event and upload images.",
      doneText: "Finish",
    },
    share: {
      firstTitle: "Let others join",
      firstDescription:
        "Share the QR code or link so others can join the event and upload images.",
      doneText: "Done",
    },
    controls: {
      guest: "Guest",
      moderator: "Moderator",
    },
    links: {
      guest: {
        title: "Guest Link",
        description:
          "Everyone with the link below will be able to upload images to this event",
      },
      moderator: {
        title: "Moderator Link",
        description:
          "Everyone with the link below will be able to moderate all uploaded images",
      },
    },
    actions: {
      downloadQr: "Download QR code",
    },
    aria: {
      moderatorAlert: "moderator link alert",
      guestLinkInput: "guest-link",
      moderatorLinkInput: "moderator-link",
      copyLink: "copy-link",
      copied: "copied",
    },
  },
};

const renderWithIntl = (component: ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

afterEach(() => {
  fromParam = null;
  cleanup();
});

describe("Share Event Page", () => {
  it("renders all components together", () => {
    const { container } = renderWithIntl(<Page />);
    const pageWrapper = container.querySelector('[class*="pageWrapper"]');

    expect(pageWrapper).not.toBeNull();
    expect(pageWrapper).toBeTruthy();
  });

  it("displays translated content", () => {
    renderWithIntl(<Page />);

    expect(screen.getByText("Your Event has been created!")).toBeTruthy();
    expect(screen.getByText(/You can share the QR code/i)).toBeTruthy();
  });

  it("renders all required components", () => {
    renderWithIntl(<Page />);

    expect(screen.getByRole("radio", { name: "Guest" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Moderator" })).toBeTruthy();
    expect(screen.getByText("Guest Link")).toBeTruthy();
    expect(screen.getByLabelText("guest-link")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Download QR code" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Finish" })).toBeTruthy();
  });

  it("renders share-origin variant when from=share", () => {
    fromParam = "share";
    renderWithIntl(<Page />);

    expect(screen.getByText("Let others join")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
  });

  it("copies link and briefly shows copied state", async () => {
    vi.useFakeTimers();
    try {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(window.navigator, "clipboard", {
        value: { writeText },
        configurable: true,
      });

      const { container } = renderWithIntl(<Page />);

      const copyIcon = container.querySelector('svg[aria-label="copy-link"]');
      expect(copyIcon).toBeTruthy();

      fireEvent.click(copyIcon!);

      await act(async () => {
        await Promise.resolve();
      });

      expect(writeText).toHaveBeenCalledTimes(1);
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/event/abc123/guest`
      );
      expect(container.querySelector('svg[aria-label="copied"]')).toBeTruthy();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1200);
      });

      expect(container.querySelector('svg[aria-label="copy-link"]')).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });
});
