import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggleButton from "./ThemeToggleButton";

const { mockedUseTheme } = vi.hoisted(() => ({
  mockedUseTheme: vi.fn(),
}));

vi.mock("@/hooks/useTheme", () => ({
  useTheme: mockedUseTheme,
}));

describe("ThemeToggleButton", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders an accessible button", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "light",
      toggleTheme: vi.fn(),
    });

    render(<ThemeToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch theme to DARK" })
    ).toBeInTheDocument();
    expect(screen.getByText("DARK")).toBeInTheDocument();
  });

  it("shows DARK when current theme is light", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "light",
      toggleTheme: vi.fn(),
    });

    render(<ThemeToggleButton />);

    expect(screen.getByText("DARK")).toBeInTheDocument();
  });

  it("shows LIGHT when current theme is dark", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "dark",
      toggleTheme: vi.fn(),
    });

    render(<ThemeToggleButton />);

    expect(screen.getByText("LIGHT")).toBeInTheDocument();
  });

  it("toggles theme when clicked", async () => {
    const toggleTheme = vi.fn();
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "light",
      toggleTheme,
    });

    const user = userEvent.setup();

    render(<ThemeToggleButton />);

    await user.click(screen.getByRole("button", { name: "Switch theme to DARK" }));

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
