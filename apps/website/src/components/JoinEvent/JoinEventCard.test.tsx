import { beforeEach, describe, expect, it, test } from "vitest";
import { screen } from "@testing-library/react";
import JoinEventCard from "./JoinEventCard";
import { renderWithQuery } from "@test-config";

describe("JoinEventCard", () => {
  beforeEach(() => {
    renderWithQuery(<JoinEventCard />);
  });

  test("without crashing", () => {
    expect(screen.getByText("title")).toBeDefined();
  });

  test("the correct title and description", () => {
    expect(screen.getByText("title")).toBeDefined();
    expect(screen.getByText("description")).toBeDefined();
  });

  test("both tab options", () => {
    expect(screen.getByText("tabs.enterCode")).toBeDefined();
    expect(screen.getByText("tabs.scanQr")).toBeDefined();
  });

  test("renders input field with correct label", () => {
    expect(screen.getByPlaceholderText("fields.eventCode.placeholder")).toBeDefined();
  });

  test("renders Join button", () => {
    expect(screen.getByText("actions.join")).toBeDefined();
  });

  it("navigates to the admin login page on click", async () => {
    const adminLink = screen.getByRole("link", { name: /admin/i });
    expect(adminLink.getAttribute("href")).toBe("/admin");
  });
});
