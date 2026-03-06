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

  it("navigates to the admin login page on click", async () => {
    const adminLink = screen.getByRole("link", { name: /admin/i });
    expect(adminLink.getAttribute("href")).toBe("/admin");
  });
});
