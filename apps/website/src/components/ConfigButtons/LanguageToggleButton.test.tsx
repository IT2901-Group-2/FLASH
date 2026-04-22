import { mockRouter, renderWithNextIntl, useLocale, useSearchParams } from "@test-config";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageToggleButton from "./LanguageToggleButton";

describe("LanguageToggleButton", () => {
  it("renders the next locale when current locale is en", () => {
    vi.mocked(useLocale).mockReturnValue("en");
    renderWithNextIntl(<LanguageToggleButton />);
    expect(screen.getByRole("button", { name: "Switch to NO" })).toBeInTheDocument();
  });

  it("renders the next locale when current locale is no", () => {
    vi.mocked(useLocale).mockReturnValue("no");
    renderWithNextIntl(<LanguageToggleButton />);
    expect(screen.getByRole("button", { name: "Switch to EN" })).toBeInTheDocument();
  });

  it("falls back to default locale when locale is missing", () => {
    vi.mocked(useLocale).mockReturnValue("");
    renderWithNextIntl(<LanguageToggleButton />);
    expect(screen.getByRole("button", { name: "Switch to NO" })).toBeInTheDocument();
  });

  it("falls back to default locale when locale is invalid", () => {
    vi.mocked(useLocale).mockReturnValue("fr");
    renderWithNextIntl(<LanguageToggleButton />);
    expect(screen.getByRole("button", { name: "Switch to NO" })).toBeInTheDocument();
  });

  it("navigates to the next locale and preserves query params", async () => {
    vi.mocked(useLocale).mockReturnValue("en");
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("foo=bar&baz=qux"));

    renderWithNextIntl(<LanguageToggleButton />);

    const button = screen.getByRole("button", { name: "Switch to NO" });
    await userEvent.click(button);

    expect(mockRouter.replace).toHaveBeenCalledWith("/no?foo=bar&baz=qux");
    expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
  });

  it("navigates without a query string when there are no search params", async () => {
    vi.mocked(useLocale).mockReturnValue("en");

    renderWithNextIntl(<LanguageToggleButton />);

    await userEvent.click(screen.getByRole("button", { name: "Switch to NO" }));
    expect(mockRouter.replace).toHaveBeenCalledWith("/no");
  });

  it("does not crash on rapid repeated clicks", async () => {
    vi.mocked(useLocale).mockReturnValue("en");

    renderWithNextIntl(<LanguageToggleButton />);

    const button = screen.getByRole("button", { name: "Switch to NO" });

    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    expect(mockRouter.replace).toHaveBeenCalledTimes(3);
    expect(mockRouter.refresh).toHaveBeenCalledTimes(3);
  });
});
