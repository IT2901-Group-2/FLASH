import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { Event } from "@/db";
import EventCard from "./EventCard";
import { createQueryClientWrapper } from "@test-config";
import { useImagesQuery } from "@/hooks/useImages";

vi.mock("@/hooks/useImages", () => ({
  useImagesQuery: vi.fn(() => ({ data: [] })),
}));

function getMockedEvent(data: Partial<Event> = {}): Event {
  return {
    id: "id",
    name: "name",
    description: "description",
    startDate: new Date(),
    endDate: new Date(),
    uploadLimit: 5,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
}

describe("EventCard", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.mocked(useImagesQuery).mockReturnValue({ data: [] } as never);
  });

  test("renders event name and formatted date", () => {
    const dateSpy = vi
      .spyOn(Date.prototype, "toLocaleString")
      .mockReturnValue("Feb 25, 2026, 10:00 AM");

    const data = getMockedEvent({
      name: "Birthday Bash",
      startDate: new Date("2026-02-25T10:00:00.000Z"),
      uploadLimit: 5,
    });

    render(<EventCard data={data} />, { wrapper: createQueryClientWrapper() });

    expect(screen.getByText("Birthday Bash")).toBeDefined();
    expect(dateSpy).toHaveBeenCalledWith(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
    expect(screen.getByText("Feb 25, 2026, 10:00 AM")).toBeDefined();
  });

  test("shows upload limit when present", () => {
    const data = getMockedEvent({
      name: "Wedding",
      startDate: new Date("2026-02-25T10:00:00.000Z"),
      uploadLimit: 12,
    });

    render(<EventCard data={data} />, { wrapper: createQueryClientWrapper() });

    expect(screen.getByText("uploadLimit.perPerson")).toBeDefined();
  });

  test("shows no photo limit when upload limit is missing", () => {
    const data = getMockedEvent({
      name: "Picnic",
      startDate: new Date("2026-02-25T10:00:00.000Z"),
      uploadLimit: undefined,
    });

    render(<EventCard data={data} />, { wrapper: createQueryClientWrapper() });

    expect(screen.getByText("uploadLimit.none")).toBeDefined();
  });

  test("renders summary labels", () => {
    const data = getMockedEvent({
      name: "Launch Party",
      startDate: new Date("2026-02-25T10:00:00.000Z"),
    });

    render(<EventCard data={data} />, { wrapper: createQueryClientWrapper() });

    expect(screen.getByText("summary.totalPhotos")).toBeDefined();
    expect(screen.getByText("summary.approved")).toBeDefined();
    expect(screen.getByText("summary.pending")).toBeDefined();
  });

  test("renders image counters from fetched images", () => {
    vi.mocked(useImagesQuery).mockReturnValue(
      {
        data: [
          {
            id: "img-1",
            eventId: "id",
            userId: "user-1",
            isApproved: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "img-2",
            eventId: "id",
            userId: "user-1",
            isApproved: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "img-3",
            eventId: "id",
            userId: "user-2",
            isApproved: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      } as never
    );

    const data = getMockedEvent();

    render(<EventCard data={data} />, { wrapper: createQueryClientWrapper() });

    expect(screen.getByTestId("event-total-photos").textContent).toContain("3");
    expect(screen.getByTestId("event-approved-photos").textContent).toContain("2");
    expect(screen.getByTestId("event-pending-photos").textContent).toContain("1");
  });
});
