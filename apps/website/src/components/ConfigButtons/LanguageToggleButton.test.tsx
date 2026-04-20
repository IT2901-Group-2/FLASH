import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageToggleButton from "./LanguageToggleButton";

const { mockedUseLocale, mockedUseSearchParams, mockedUsePathname, mockedUseRouter } =
  vi.hoisted(() => ({
    mockedUseLocale: vi.fn(),
    mockedUseSearchParams: vi.fn(),
    mockedUsePathname: vi.fn(),
    mockedUseRouter: vi.fn(),
  }));

vi.mock("next/navigation", () => ({
  useSearchParams: mockedUseSearchParams,
}));

vi.mock("next-intl", () => ({
  useLocale: mockedUseLocale,
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: mockedUsePathname,
  useRouter: mockedUseRouter,
}));

describe("LanguageToggleButton", () => {
  let replaceMock: ReturnType<typeof vi.fn>;
  let refreshMock: ReturnType<typeof vi.fn>;

  const setupMocks = ({
    locale = "en",
    pathname = "/admin/dashboard/events/123",
    query = "tab=details",
  }: {
    locale?: string | undefined;
    pathname?: string;
    query?: string;
  } = {}) => {
    replaceMock = vi.fn();
    refreshMock = vi.fn();

    mockedUseLocale.mockReturnValue(locale);
    mockedUsePathname.mockReturnValue(pathname);
    mockedUseSearchParams.mockReturnValue({
      toString: () => query,
    });
    mockedUseRouter.mockReturnValue({
      replace: replaceMock,
      refresh: refreshMock,
    });
  };

  it("renders the next locale when current locale is en", () => {
    setupMocks({ locale: "en" });

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", {
        name: "Current language: EN. Switch to NO",
      })
    ).toBeInTheDocument();
  });

  it("renders the next locale when current locale is no", () => {
    setupMocks({ locale: "no" });

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", {
        name: "Current language: NO. Switch to EN",
      })
    ).toBeInTheDocument();
  });

  it("falls back to default locale when locale is missing", () => {
    setupMocks({ locale: undefined });

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", {
        name: "Current language: EN. Switch to NO",
      })
    ).toBeInTheDocument();
  });

  it("falls back to default locale when locale is invalid", () => {
    setupMocks({ locale: "fr" });

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", {
        name: "Current language: EN. Switch to NO",
      })
    ).toBeInTheDocument();
  });

  it("navigates to the next locale and preserves query params", async () => {
    setupMocks({ locale: "en", query: "tab=details" });
    const user = userEvent.setup();

    render(<LanguageToggleButton />);

    const button = screen.getByRole("button", {
      name: "Current language: EN. Switch to NO",
    });

    await user.click(button);

    expect(replaceMock).toHaveBeenCalledWith("/admin/dashboard/events/123?tab=details", {
      locale: "no",
    });
    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });

  it("navigates without a query string when there are no search params", async () => {
    setupMocks({ locale: "en", query: "" });
    const user = userEvent.setup();

    render(<LanguageToggleButton />);

    await user.click(
      screen.getByRole("button", {
        name: "Current language: EN. Switch to NO",
      })
    );

    expect(replaceMock).toHaveBeenCalledWith("/admin/dashboard/events/123", {
      locale: "no",
    });
  });

  it("ignores rapid repeated clicks", async () => {
    setupMocks({ locale: "en", query: "tab=details" });
    const user = userEvent.setup();

    render(<LanguageToggleButton />);

    const button = screen.getByRole("button", {
      name: "Current language: EN. Switch to NO",
    });

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
