import { mockRouter } from "@test-config";
import { describe, it, expect } from "vitest";
import Logo from "./Logo";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Logo", () => {
  it("should render the logo component", () => {
    render(<Logo />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("should redirect when redirectTo prop is provided", async () => {
    const redirectTo = "/home";
    render(<Logo redirectTo={redirectTo} />);

    await userEvent.click(screen.getByTestId("logo"));
    expect(mockRouter.push).toHaveBeenCalledWith(redirectTo);
  });

  it("should not redirect when redirectTo prop is not provided", async () => {
    render(<Logo />);
    await userEvent.click(screen.getByTestId("logo"));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
