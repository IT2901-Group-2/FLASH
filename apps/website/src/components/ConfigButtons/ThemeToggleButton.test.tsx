import { isMountedHookMock, mockThemeReady, UNMOUNTED } from "@test-config";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "@/hooks/useTheme";
import { useIsMounted } from "@/hooks/useIsMounted";

vi.mock("@/hooks/useIsMounted", () => isMountedHookMock());

describe("ThemeToggleButton", () => {
  it("uses a stable fallback before mounted", () => {
    vi.mocked(useIsMounted).mockReturnValue(UNMOUNTED);
    vi.mocked(useTheme).mockReturnValue(mockThemeReady({ resolvedTheme: "dark" }));

    const { container } = render(<ThemeToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("dark-button")).toBeInTheDocument();
    expect(
      container.querySelector("[data-testid='light-button']")
    ).not.toBeInTheDocument();
  });

  it("uses DARK as the next theme when current theme is light", () => {
    vi.mocked(useTheme).mockReturnValue(mockThemeReady({ resolvedTheme: "light" }));

    render(<ThemeToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("dark-button")).toBeInTheDocument();
  });

  it("uses LIGHT as the next theme when current theme is dark", () => {
    vi.mocked(useTheme).mockReturnValue(mockThemeReady({ resolvedTheme: "dark" }));

    render(<ThemeToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("light-button")).toBeInTheDocument();
  });

  it("toggles theme when clicked", async () => {
    const toggleTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue(
      mockThemeReady({ resolvedTheme: "light", toggleTheme })
    );

    render(<ThemeToggleButton />);

    await userEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
