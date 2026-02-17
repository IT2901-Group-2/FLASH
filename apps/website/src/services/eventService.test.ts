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
    guestCode: "birthday-1-guest",
    moderatorCode: "birthday-1-moderator",
  },
  {
    id: "wedding-1",
    name: "Wedding 1",
    startDate: addDays(NOW, 10),
    endDate: addDays(NOW, 11),
    uploadLimit: 10,
    guestCode: "wedding-1-guest",
    moderatorCode: "wedding-1-moderator",
  },
  {
    id: "wedding-2",
    name: "Wedding 2",
    startDate: subDays(NOW, 5),
    endDate: subDays(NOW, 4),
    guestCode: "wedding-2-guest",
    moderatorCode: "wedding-2-moderator",
  },
  {
    id: "lowercase-1",
    name: "lowercase",
    startDate: subDays(NOW, 1),
    endDate: subDays(NOW, 1),
    guestCode: "lowercase-1-guest",
    moderatorCode: "lowercase-1-moderator",
  },
  {
    id: "uppercase-1",
    name: "UPPERCASE",
    startDate: subHours(NOW, 1),
    endDate: addHours(NOW, 1),
    guestCode: "uppercase-1-guest",
    moderatorCode: "uppercase-1-moderator",
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

  it("Should correctly filter by guest code", async () => {
    expect(
      await eventService
        .getEvents({ guestCode: "birthday-1-moderator" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await eventService
        .getEvents({ guestCode: "birthday-1-guest" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-1"]));
  });

  it("Should correctly filter by moderator code", async () => {
    expect(
      await eventService
        .getEvents({ moderatorCode: "wedding-2-guest" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await eventService
        .getEvents({ moderatorCode: "wedding-2-moderator" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["wedding-2"]));
  });
});
