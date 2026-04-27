import {
  eventHooksMock,
  imageHooksMock,
  makeEvent,
  makeEventStats,
  mockEventStatsLoaded,
  renderWithQuery,
} from "@test-config";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import EventCard from "./EventCard";
import userEvent from "@testing-library/user-event";
import { useDeleteEventMutation, useEventStatsQuery } from "@/hooks/useEvents";

vi.mock("@/hooks/useImages", () => imageHooksMock());
vi.mock("@/hooks/useEvents", () => eventHooksMock());

describe("EventCard", () => {
  it("renders event name and formatted date", () => {
    const dateSpy = vi
      .spyOn(Date.prototype, "toLocaleString")
      .mockReturnValue("Feb 25, 2026, 10:00 AM");

    const data = makeEvent({
      name: "Birthday Bash",
      startDate: new Date("2026-02-25T10:00:00.000Z"),
    });

    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByText("Birthday Bash")).toBeDefined();
    expect(dateSpy).toHaveBeenCalledWith(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
    expect(screen.getByText("Feb 25, 2026, 10:00 AM")).toBeDefined();
  });

  it("shows upload limit when present", () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByText("uploadLimit.perPerson")).toBeDefined();
  });

  it("shows no photo limit when upload limit is missing", () => {
    const data = makeEvent({
      uploadLimit: undefined,
    });
    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByText("uploadLimit.none")).toBeDefined();
  });

  it("renders summary labels", () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByText("summary.totalPhotos")).toBeDefined();
    expect(screen.getByText("summary.approved")).toBeDefined();
    expect(screen.getByText("summary.pending")).toBeDefined();
  });

  it("renders image counters from fetched images", () => {
    vi.mocked(useEventStatsQuery).mockReturnValue(
      mockEventStatsLoaded(makeEventStats({ pendingImages: 1, approvedImages: 2 }))
    );

    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByTestId("event-total-photos").textContent).toContain("3");
    expect(screen.getByTestId("event-approved-photos").textContent).toContain("2");
    expect(screen.getByTestId("event-pending-photos").textContent).toContain("1");
  });

  it("opens the dialog to edit the event", async () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    await userEvent.click(screen.getByTestId("edit-button"));
    expect(screen.getByTestId("edit-event-dialog")).toBeInTheDocument();
  });

  it("opens the delete dialog and delets the event", async () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);

    await userEvent.click(screen.getByTestId("delete-button"));
    expect(useDeleteEventMutation().mutate).not.toHaveBeenCalledOnce();

    await userEvent.click(screen.getByText("delete"));
    expect(useDeleteEventMutation().mutate).toHaveBeenCalledOnce();
  });

  it("opens the delete dialog and does not delete the event", async () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    await userEvent.click(screen.getByTestId("delete-button"));
    await userEvent.click(screen.getAllByText("cancel")[0]!);
    expect(useDeleteEventMutation().mutate).not.toHaveBeenCalledOnce();
  });
});
