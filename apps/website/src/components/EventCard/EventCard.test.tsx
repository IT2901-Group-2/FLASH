import {
  eventHooksMock,
  imageHooksMock,
  makeEvent,
  makeImage,
  mockImagesLoaded,
  renderWithQuery,
} from "@test-config";
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import EventCard from "./EventCard";
import { useImagesQuery } from "@/hooks/useImages";
import userEvent from "@testing-library/user-event";
import { useDeleteEventMutation } from "@/hooks/useEvents";

vi.mock("@/hooks/useImages", () => imageHooksMock());
vi.mock("@/hooks/useEvents", () => eventHooksMock());

describe("EventCard", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test("renders event name and formatted date", () => {
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

  test("shows upload limit when present", () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByText("uploadLimit.perPerson")).toBeDefined();
  });

  test("shows no photo limit when upload limit is missing", () => {
    const data = makeEvent({
      uploadLimit: undefined,
    });
    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByText("uploadLimit.none")).toBeDefined();
  });

  test("renders summary labels", () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByText("summary.totalPhotos")).toBeDefined();
    expect(screen.getByText("summary.approved")).toBeDefined();
    expect(screen.getByText("summary.pending")).toBeDefined();
  });

  test("renders image counters from fetched images", () => {
    vi.mocked(useImagesQuery).mockReturnValue(
      mockImagesLoaded([
        makeImage({ isApproved: true }),
        makeImage({ isApproved: true }),
        makeImage({ isApproved: null }),
      ])
    );
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    expect(screen.getByTestId("event-total-photos").textContent).toContain("3");
    expect(screen.getByTestId("event-approved-photos").textContent).toContain("2");
    expect(screen.getByTestId("event-pending-photos").textContent).toContain("1");
  });

  test("edits the event", async () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    await userEvent.click(screen.getByTestId("edit-button"));
    expect(screen.getByTestId("edit-event-dialog")).toBeInTheDocument();
  });

  test("delets the event", async () => {
    const data = makeEvent();
    renderWithQuery(<EventCard data={data} />);
    await userEvent.click(screen.getByTestId("delete-button"));
    expect(useDeleteEventMutation).toHaveBeenCalledOnce();
  });
});
