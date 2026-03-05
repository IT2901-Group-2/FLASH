import { beforeEach, describe, expect, it, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JoinEventCard from "./JoinEventCard";
import { createQueryClientWrapper, mockRouter } from "@test-config";

describe("JoinEventCard", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });
    user = userEvent.setup();
  });

  test("without crashing", () => {
    expect(screen.getByText("title")).toBeDefined();
  });

  test("the correct title and description", () => {
    expect(screen.getByText("title")).toBeDefined();
    expect(screen.getByText("description")).toBeDefined();
  });

  test("both tab options", () => {
    expect(screen.getByText("eventCodeLabel")).toBeDefined();
    expect(screen.getByText("scanQrTab")).toBeDefined();
  });

  test("renders input field with correct label", () => {
    expect(screen.getByText("enterCodeTab")).toBeDefined();
  });

  test("renders Join button", () => {
    expect(screen.getByText("joinButton")).toBeDefined();
  });

  test("shows validation error when event code is empty", async () => {
    const button = screen.getByText("joinButton");

    await user.click(button);

    expect(await screen.findAllByText("error.noCode")).toBeDefined();
  });

  test("redirects to event page on successful lookup", async () => {
    const codeInput = screen.getByPlaceholderText("eventCodePlaceholder");
    const button = screen.getByText("joinButton");

    await user.type(codeInput, "ABC123");
    await user.click(button);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  test("shows not-found error when lookup returns no events", async () => {
    const input = screen.getByPlaceholderText("eventCodePlaceholder");
    const button = screen.getByText("joinButton");

    await user.type(input, "MISSING");
    await user.click(button);

    await waitFor(() => {
      expect(screen.findByText("error.invalidCode")).toBeDefined();
    });
  });

  test("submits when pressing Enter in the code field", async () => {
    const input = screen.getByPlaceholderText("eventCodePlaceholder");

    await user.type(input, "ENTER1");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  it("navigates to the admin login page on click", async () => {
    const adminLink = screen.getByRole("link", { name: /admin/i });
    expect(adminLink.getAttribute("href")).toBe("/admin");
  });
});
