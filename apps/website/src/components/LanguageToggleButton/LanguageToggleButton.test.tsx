import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageToggleButton from "./LanguageToggleButton";

const { mockedUseParams } = vi.hoisted(() => ({
  mockedUseParams: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: mockedUseParams,
}));

describe("LanguageToggleButton", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders an accessible button", () => {
    mockedUseParams.mockReturnValue({ locale: "en" });

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch language to NO" })
    ).toBeInTheDocument();
    expect(screen.getByText("NO")).toBeInTheDocument();
  });

  it("shows NO when current locale is EN", () => {
    mockedUseParams.mockReturnValue({ locale: "en" });

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch language to NO" })
    ).toBeInTheDocument();
    expect(screen.getByText("NO")).toBeInTheDocument();
  });

  it("shows EN when current locale is NO", () => {
    mockedUseParams.mockReturnValue({ locale: "no" });

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch language to EN" })
    ).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("falls back to default locale when route locale is missing", () => {
    mockedUseParams.mockReturnValue({});

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch language to NO" })
    ).toBeInTheDocument();
    expect(screen.getByText("NO")).toBeInTheDocument();
  });

  it("falls back to default locale when route locale is invalid", () => {
    mockedUseParams.mockReturnValue({ locale: "fr" });

    render(<LanguageToggleButton />);

    expect(
      screen.getByRole("button", { name: "Switch language to NO" })
    ).toBeInTheDocument();
    expect(screen.getByText("NO")).toBeInTheDocument();
  });

  it("navigates to the next locale when clicked", async () => {
    mockedUseParams.mockReturnValue({ locale: "en" });

    const user = userEvent.setup();
    const assignMock = vi.fn();

    const originalLocation = window.location;

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...originalLocation,
        assign: assignMock,
      },
    });

    render(<LanguageToggleButton />);

    await user.click(
      screen.getByRole("button", { name: "Switch language to NO" })
    );

    expect(assignMock).toHaveBeenCalledWith("/no");

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});