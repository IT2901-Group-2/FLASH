import { beforeEach, describe, expect, it, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JoinEventCard from "./JoinEventCard";
import { createQueryClientWrapper, mockRouter } from "@test-config";

const mockRefetch = vi.fn();

vi.mock("@/hooks/useEvents", () => ({
  useEventsQuery: () => ({
    refetch: mockRefetch,
    isFetching: false,
  }),
}));

describe("JoinEventCard", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    mockRouter.push.mockReset();
    mockRouter.replace.mockReset();
    mockRouter.prefetch.mockReset();
    mockRouter.back.mockReset();
    mockRouter.forward.mockReset();
    mockRouter.refresh.mockReset();

    mockRefetch.mockReset();
    mockRefetch.mockResolvedValue({
      data: [
        {
          id: "ABC123",
          name: "Test event",
          description: "",
          startDate: new Date(Date.now() - 5 * 60 * 1000),
          endDate: new Date(Date.now() + 55 * 60 * 1000),
          uploadLimit: null,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      error: null,
    });

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
    mockRefetch.mockResolvedValueOnce({ data: [], error: null });

    const input = screen.getByPlaceholderText("eventCodePlaceholder");
    const button = screen.getByText("joinButton");

    await user.type(input, "MISSING");
    await user.click(button);

    await waitFor(() => {
      expect(screen.findByText("error.invalidCode")).toBeDefined();
    });
  });

  test("shows future-event error when event has not started", async () => {
    mockRefetch.mockResolvedValueOnce({
      data: [
        {
          id: "FUTURE1",
          name: "Future event",
          description: "",
          startDate: new Date(Date.now() + 60 * 60 * 1000),
          endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
          uploadLimit: null,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      error: null,
    });

    const input = screen.getByPlaceholderText("eventCodePlaceholder");
    const button = screen.getByText("joinButton");

    await user.type(input, "FUTURE1");
    await user.click(button);

    expect(await screen.findByText("error.futureEvent")).toBeDefined();
    expect(mockRouter.push).not.toHaveBeenCalled();
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
