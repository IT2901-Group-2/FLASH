import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { Event } from "@/db";
import EventCard from "./EventCard";

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

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("EventCard", () => {
  test("renders event name and formatted date", () => {
    const dateSpy = vi
      .spyOn(Date.prototype, "toLocaleString")
      .mockReturnValue("Feb 25, 2026, 10:00 AM");

    const data = getMockedEvent({
      name: "Birthday Bash",
      startDate: new Date("2026-02-25T10:00:00.000Z"),
      uploadLimit: 5,
    });

    render(<EventCard data={data} />);

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

    render(<EventCard data={data} />);

    expect(screen.getByText("12 photos per person")).toBeDefined();
  });

  test("shows no photo limit when upload limit is missing", () => {
    const data = getMockedEvent({
      name: "Picnic",
      startDate: new Date("2026-02-25T10:00:00.000Z"),
    });

    render(<EventCard data={data} />);

    expect(screen.getByText("No photo limit")).toBeDefined();
  });

  test("renders summary labels", () => {
    const data = getMockedEvent({
      name: "Launch Party",
      startDate: new Date("2026-02-25T10:00:00.000Z"),
    });

    render(<EventCard data={data} />);

    expect(screen.getByText("Total Photos")).toBeDefined();
    expect(screen.getByText("Approved")).toBeDefined();
    expect(screen.getByText("Pending")).toBeDefined();
  });
});
