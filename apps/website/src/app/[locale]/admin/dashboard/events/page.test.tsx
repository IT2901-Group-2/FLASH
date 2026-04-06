import { eventHooksMock, mockEventsLoading, renderWithQuery } from "@test-config";
import { screen } from "@testing-library/react";
import { expect, vi, describe, it } from "vitest";
import { useEventsQuery } from "@/hooks/useEvents";
import Page from "./page";

vi.mock("@/hooks/useEvents", () => eventHooksMock());

describe("Page", () => {
  it("shows the spinner when loading", () => {
    vi.mocked(useEventsQuery).mockReturnValue(mockEventsLoading());
    renderWithQuery(<Page />);
    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("shows events when loaded", () => {
    renderWithQuery(<Page />);

    expect(screen.queryByTestId("loading-spinner")).toBeNull();
    expect(screen.getAllByTestId("dialog")).toHaveLength(1);
  });
});
