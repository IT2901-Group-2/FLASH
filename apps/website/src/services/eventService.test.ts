// @vitest-environment node
import { describe, it, beforeEach, expect, vi } from "vitest";
import { DatabaseService } from "./databaseService";
import { Result } from "typescript-result";
import { EventService } from "./eventService";
import { eventTable } from "@/db";
import { subDays, addDays, setHours, subHours, addHours } from "date-fns";

const NOW = new Date();

const mockEvents: (typeof eventTable.$inferInsert)[] = [
  {
    id: "birthday-1",
    name: "Birthday",
    startDate: setHours(NOW, 11),
    endDate: setHours(NOW, 14),
    uploadLimit: 5,
  },
  {
    id: "wedding-1",
    name: "Wedding 1",
    startDate: addDays(NOW, 10),
    endDate: addDays(NOW, 11),
    uploadLimit: 10,
  },
  {
    id: "wedding-2",
    name: "Wedding 2",
    startDate: subDays(NOW, 5),
    endDate: subDays(NOW, 4),
  },
  {
    id: "lowercase-1",
    name: "lowercase",
    startDate: subDays(NOW, 1),
    endDate: subDays(NOW, 1),
  },
  {
    id: "uppercase-1",
    name: "UPPERCASE",
    startDate: subHours(NOW, 1),
    endDate: addHours(NOW, 1),
  },
];

let eventService: EventService;

beforeEach(async () => {
  const dbService = await DatabaseService.create({
    read: vi.fn(() => Result.error(new Error())),
  } as never).getOrThrow();

  await dbService.db.insert(eventTable).values(mockEvents);

  eventService = new EventService(dbService);
});

describe("EventService getEvents", () => {
  it("Should get all mock data", async () => {
    expect(await eventService.getEvents().getOrThrow()).toHaveLength(mockEvents.length);
  });

  it("Should correctly filter by id", async () => {
    expect(
      await eventService
        .getEvents({ id: ["unknown-id"] })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await eventService
        .getEvents({ id: ["wedding-1"] })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["wedding-1"]));

    expect(
      await eventService
        .getEvents({ id: ["uppercase-1", "birthday-1"] })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["uppercase-1", "birthday-1"]));
  });

  it("Should correctly filter by name", async () => {
    expect(
      await eventService
        .getEvents({ name: "Birthday" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-1"]));

    expect(
      await eventService
        .getEvents({ name: "eddi" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["wedding-1", "wedding-2"]));

    expect(
      await eventService
        .getEvents({ name: "gibberish" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await eventService
        .getEvents({ name: "LOwErCaSE" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["lowercase-1"]));

    expect(
      await eventService
        .getEvents({ name: "uppercase" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["uppercase-1"]));
  });
});
