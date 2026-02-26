import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { EventDTO } from "@/types/eventTypes";
import EventCard from "./EventCard";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("EventCard", () => {
  test("renders event name and formatted date", () => {
    const dateSpy = vi
      .spyOn(Date.prototype, "toLocaleString")
      .mockReturnValue("Feb 25, 2026, 10:00 AM");

    const data = {
      name: "Birthday Bash",
      startDate: "2026-02-25T10:00:00.000Z",
      uploadLimit: 5,
    } as EventDTO;

    render(<EventCard data={data} />);

    expect(screen.getByText("Birthday Bash")).toBeDefined();
    expect(dateSpy).toHaveBeenCalledWith(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
    expect(screen.getByText("Feb 25, 2026, 10:00 AM")).toBeDefined();
  });

  test("shows upload limit when present", () => {
    const data = {
      name: "Wedding",
      startDate: "2026-02-25T10:00:00.000Z",
      uploadLimit: 12,
    } as EventDTO;

    render(<EventCard data={data} />);

    expect(screen.getByText("12 photos per person")).toBeDefined();
  });

  test("shows no photo limit when upload limit is missing", () => {
    const data = {
      name: "Picnic",
      startDate: "2026-02-25T10:00:00.000Z",
    } as EventDTO;

    render(<EventCard data={data} />);

    expect(screen.getByText("No photo limit")).toBeDefined();
  });

  test("renders summary labels", () => {
    const data = {
      name: "Launch Party",
      startDate: "2026-02-25T10:00:00.000Z",
    } as EventDTO;

    render(<EventCard data={data} />);

    expect(screen.getByText("Total Photos")).toBeDefined();
    expect(screen.getByText("Approved")).toBeDefined();
    expect(screen.getByText("Pending")).toBeDefined();
  });
});
