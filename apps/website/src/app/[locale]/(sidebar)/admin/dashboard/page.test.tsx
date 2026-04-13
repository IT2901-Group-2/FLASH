import {
  eventHooksMock,
  makeEvent,
  mockEventsLoaded,
  mockEventsLoading,
  mockRouter,
  renderWithQuery,
} from "@test-config";
import { screen } from "@testing-library/react";
import { expect, vi, describe, it } from "vitest";
import { useEventsQuery } from "@/hooks/useEvents";
import Page from "./page";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useEvents", () => eventHooksMock());

describe("Page", () => {
  it("shows the spinner when loading", () => {
    vi.mocked(useEventsQuery).mockReturnValue(mockEventsLoading());
    renderWithQuery(<Page />);
    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("shows events when loaded", async () => {
    renderWithQuery(<Page />);

    await expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("opens the create dialog when clicked", async () => {
    renderWithQuery(<Page />);

    await userEvent.click(screen.getByText("createNewEvent"));
    expect(screen.getByTestId("dialog")).toBeVisible();
  });

  it("navigates to an event page when clicked", async () => {
    vi.mocked(useEventsQuery).mockReturnValue(
      mockEventsLoaded([makeEvent({ id: "1", name: "Event 1" })])
    );
    renderWithQuery(<Page />);

    await userEvent.click(screen.getByText("Event 1"));
    expect(mockRouter.push).toHaveBeenCalledWith("./dashboard/1");
  });
});
