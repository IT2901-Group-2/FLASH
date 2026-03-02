import { beforeEach, describe, expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JoinEventCard from "./JoinEventCard";
import { createQueryClientWrapper, mockFetch } from "@test-config";

describe("JoinEventCard", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test("without crashing", () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });
    expect(screen.getByText("title")).toBeDefined();
  });

  test("the correct title and description", () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });
    expect(screen.getByText("title")).toBeDefined();
    expect(screen.getByText("description")).toBeDefined();
  });

  test("both tab options", () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });
    expect(screen.getByText("eventCodeLabel")).toBeDefined();
    expect(screen.getByText("scanQrTab")).toBeDefined();
  });

  test("renders input field with correct label", () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });
    expect(screen.getByText("enterCodeTab")).toBeDefined();
  });

  test("renders Join button", () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });
    expect(screen.getByText("joinButton")).toBeDefined();
  });

  test("shows validation error when event code is empty", async () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });

    const button = screen.getByText("joinButton");

    await user.click(button);

    expect(await screen.findAllByText("error.noCode")).toBeDefined();
  });

  test("calls API and routes to event page on successful lookup", async () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });

    const codeInput = screen.getByPlaceholderText("eventCodePlaceholder");
    const button = screen.getByText("joinButton");

    await user.type(codeInput, "ABC123");
    await user.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  test("shows not-found error when lookup returns no events", async () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });

    const input = screen.getByPlaceholderText("eventCodePlaceholder");
    const button = screen.getByText("joinButton");

    await user.type(input, "MISSING");
    await user.click(button);

    await waitFor(() => {
      expect(screen.findByText("error.invalidCode")).toBeDefined();
    });
  });

  test("submits when pressing Enter in the code field", async () => {
    render(<JoinEventCard />, { wrapper: createQueryClientWrapper() });

    const nicknameInput = screen.getByText("nicknameLabel");
    const input = screen.getByPlaceholderText("eventCodePlaceholder");

    await user.type(nicknameInput, "NICKNAME");
    await user.type(input, "ENTER1");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
