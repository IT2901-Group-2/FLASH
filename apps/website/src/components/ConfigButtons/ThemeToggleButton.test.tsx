import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggleButton from "./ThemeToggleButton";

const { mockedUseTheme, mockedUseIsMounted } = vi.hoisted(() => ({
  mockedUseTheme: vi.fn(),
  mockedUseIsMounted: vi.fn(),
}));

vi.mock("@/hooks/useTheme", () => ({
  useTheme: mockedUseTheme,
}));

vi.mock("@/hooks/useIsMounted", () => ({
  useIsMounted: mockedUseIsMounted,
}));

describe("ThemeToggleButton", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("uses a stable fallback before mounted", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "dark",
      toggleTheme: vi.fn(),
    });
    mockedUseIsMounted.mockReturnValue(false);

    const { container } = render(<ThemeToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" })
    ).toBeInTheDocument();
    expect(container.querySelector(".lucide-moon")).toBeInTheDocument();
    expect(container.querySelector(".lucide-sun")).not.toBeInTheDocument();
  });

  it("uses DARK as the next theme when current theme is light", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "light",
      toggleTheme: vi.fn(),
    });
    mockedUseIsMounted.mockReturnValue(true);

    const { container } = render(<ThemeToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" })
    ).toBeInTheDocument();
    expect(container.querySelector(".lucide-moon")).toBeInTheDocument();
  });

  it("uses LIGHT as the next theme when current theme is dark", () => {
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "dark",
      toggleTheme: vi.fn(),
    });
    mockedUseIsMounted.mockReturnValue(true);

    const { container } = render(<ThemeToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();
    expect(container.querySelector(".lucide-sun")).toBeInTheDocument();
  });

  it("toggles theme when clicked", async () => {
    const toggleTheme = vi.fn();
    mockedUseTheme.mockReturnValue({
      resolvedTheme: "light",
      toggleTheme,
    });
    mockedUseIsMounted.mockReturnValue(true);

    const user = userEvent.setup();

    render(<ThemeToggleButton />);

    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
