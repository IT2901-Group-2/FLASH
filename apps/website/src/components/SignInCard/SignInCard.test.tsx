import { renderWithQuery } from "@test-config";
import { describe, expect, it, vi } from "vitest";
import SignInCard from "./SignInCard";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SignInCard", () => {
  describe("rendering", () => {
    it("renders the heading", () => {
      renderWithQuery(<SignInCard />);
      expect(screen.getByText("heading")).toBeInTheDocument();
    });

    it("renders the description", () => {
      renderWithQuery(<SignInCard />);
      expect(screen.getByText("description")).toBeInTheDocument();
    });

    it("renders a password input", () => {
      renderWithQuery(<SignInCard />);
      expect(screen.getByTestId("input")).toBeInTheDocument();
    });

    it("renders the password input as type password", () => {
      renderWithQuery(<SignInCard />);
      expect(screen.getByTestId("input")).toHaveAttribute("type", "password");
    });

    it("renders the password input with the correct aria-label", () => {
      renderWithQuery(<SignInCard />);
      expect(screen.getByTestId("input")).toHaveAttribute(
        "aria-label",
        "fields.password"
      );
    });

    it("renders the sign in button", () => {
      renderWithQuery(<SignInCard />);
      expect(screen.getByRole("button", { name: "actions.signIn" })).toBeInTheDocument();
    });

    it("renders the guest access link pointing to /", () => {
      renderWithQuery(<SignInCard />);
      expect(screen.getByRole("link", { name: "roles.guest" })).toHaveAttribute(
        "href",
        "/"
      );
    });
  });

  describe("password input", () => {
    it("starts with an empty value", () => {
      renderWithQuery(<SignInCard />);
      expect(screen.getByTestId("input")).toHaveValue("");
    });

    it("updates the value as the user types", async () => {
      renderWithQuery(<SignInCard />);
      await userEvent.type(screen.getByTestId("input"), "secret123");
      expect(screen.getByTestId("input")).toHaveValue("secret123");
    });
  });
});
