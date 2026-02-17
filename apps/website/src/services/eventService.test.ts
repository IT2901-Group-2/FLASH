// @vitest-environment node
import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import { DatabaseService } from "./databaseService";
import { Result } from "typescript-result";
import { EventService } from "./eventService";
import { eventTable } from "@/db";
import { subDays, addDays, subHours, addHours, setMilliseconds } from "date-fns";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";

const NOW = new Date();

const mockEvents: (typeof eventTable.$inferInsert)[] = [
  {
    id: "birthday-1",
    name: "Birthday 1",
    startDate: subHours(NOW, 6),
    endDate: subHours(NOW, 5),
    uploadLimit: 5,
    guestCode: "birthday-1-guest",
    moderatorCode: "birthday-1-moderator",
  },
  {
    id: "birthday-2",
    name: "Birthday 2",
    startDate: subHours(NOW, 2),
    endDate: addHours(NOW, 10),
    uploadLimit: 5,
    guestCode: "birthday-2-guest",
    moderatorCode: "birthday-2-moderator",
    isArchived: true,
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
    write: vi.fn(() => Result.ok()),
  } as never).getOrThrow();

  await dbService.db.insert(eventTable).values(mockEvents);

  eventService = new EventService(dbService);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("EventService getEvents", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "select").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await eventService.getEvents());
  });

  it("Should correctly filter by id", async () => {
    expect(
      await eventService
        .getEvents({ id: ["unknown-id"], archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await eventService
        .getEvents({ id: ["wedding-1"], archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["wedding-1"]));

    expect(
      await eventService
        .getEvents({ id: ["uppercase-1", "birthday-1"], archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["uppercase-1", "birthday-1"]));
  });

  it("Should correctly filter by name", async () => {
    expect(
      await eventService
        .getEvents({ name: "Birthday", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-1"]));

    expect(
      await eventService
        .getEvents({ name: "eddi", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["wedding-1", "wedding-2"]));

    expect(
      await eventService
        .getEvents({ name: "gibberish", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await eventService
        .getEvents({ name: "LOwErCaSE", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["lowercase-1"]));

    expect(
      await eventService
        .getEvents({ name: "uppercase", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["uppercase-1"]));
  });

  it("Should correctly filter by guest code", async () => {
    expect(
      await eventService
        .getEvents({ guestCode: "birthday-1-moderator", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await eventService
        .getEvents({ guestCode: "birthday-1-guest", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-1"]));
  });

  it("Should correctly filter by moderator code", async () => {
    expect(
      await eventService
        .getEvents({ moderatorCode: "wedding-2-guest", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set([]));

    expect(
      await eventService
        .getEvents({ moderatorCode: "wedding-2-moderator", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["wedding-2"]));
  });

  it("Should correctly filter by status", async () => {
    expect(
      await eventService
        .getEvents({ status: "finished" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-1", "wedding-2", "lowercase-1"]));

    expect(
      await eventService
        .getEvents({ status: "active" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-2", "uppercase-1"]));

    expect(
      await eventService
        .getEvents({ status: "upcoming" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["wedding-1"]));
  });

  it("Should correctly filter by isArchived", async () => {
    expect(
      await eventService
        .getEvents()
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(
      new Set([
        "birthday-1",
        "birthday-2",
        "wedding-1",
        "wedding-2",
        "lowercase-1",
        "uppercase-1",
      ])
    );

    expect(
      await eventService
        .getEvents({ archived: true })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-2"]));

    expect(
      await eventService
        .getEvents({ archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(
      new Set(["birthday-1", "wedding-1", "wedding-2", "lowercase-1", "uppercase-1"])
    );
  });

  it("Should correctly filter by combination", async () => {
    expect(
      await eventService
        .getEvents({ status: "active", archived: false })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["uppercase-1"]));

    expect(
      await eventService
        .getEvents({ status: "finished", name: "d" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-1", "wedding-2"]));

    expect(
      await eventService
        .getEvents({ status: "finished", name: "1", guestCode: "birthday-1-guest" })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-1"]));

    expect(
      await eventService
        .getEvents({ status: "finished", id: ["lowercase-1"] })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["lowercase-1"]));

    expect(
      await eventService
        .getEvents({ name: "birthday", id: ["wedding-1", "lowercase-1", "birthday-2"] })
        .map(rows => new Set(rows.map(row => row.id)))
        .getOrThrow()
    ).toStrictEqual(new Set(["birthday-2"]));
  });
});

describe("eventService createEvent", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "insert").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(
      await eventService.createEvent({
        name: "newEvent",
        startDate: NOW,
        endDate: NOW,
      })
    );
  });

  it("Should correctly create event", async () => {
    const startDate = setMilliseconds(subHours(NOW, 1), 0);
    const endDate = setMilliseconds(addHours(NOW, 1), 0);

    const newEvent = await eventService
      .createEvent({
        name: "newEvent",
        description: "desc",
        startDate,
        endDate,
      })
      .getOrThrow();

    expect(newEvent.name).toBe("newEvent");
    expect(newEvent.description).toBe("desc");
    expect(newEvent.startDate).toStrictEqual(startDate);
    expect(newEvent.endDate).toStrictEqual(endDate);
    expect(newEvent.uploadLimit).toBeNull();
    expect(newEvent.isArchived).toBe(false);

    expect(
      await eventService["dbService"].db
        .select()
        .from(eventTable)
        .then(rows => new Set(rows.map(row => row.id)))
    ).toStrictEqual(
      new Set([
        "birthday-1",
        "birthday-2",
        "wedding-1",
        "wedding-2",
        "lowercase-1",
        "uppercase-1",
        newEvent.id,
      ])
    );
  });

  it("Should flush after creating event", async () => {
    const flush = vi.spyOn(DatabaseService.prototype, "flush");

    await eventService.createEvent({ name: "newEvent", startDate: NOW, endDate: NOW });

    expect(flush).toHaveBeenCalledOnce();
  });
});

describe("eventService updateEvent", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "update").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(
      await eventService.updateEvent("birthday-1", { name: "Not birthday" })
    );
  });

  it("Should correctly update event", async () => {
    const startDate = setMilliseconds(subHours(NOW, 1), 0);
    const endDate = setMilliseconds(addHours(NOW, 1), 0);

    const updatedEvent = await eventService
      .updateEvent("birthday-1", {
        name: "Not birthday",
        description: "new description",
        startDate,
        endDate,
        uploadLimit: 999,
        isArchived: true,
      })
      .getOrThrow();

    expect(updatedEvent.name).toBe("Not birthday");
    expect(updatedEvent.description).toBe("new description");
    expect(updatedEvent.startDate).toStrictEqual(startDate);
    expect(updatedEvent.endDate).toStrictEqual(endDate);
    expect(updatedEvent.uploadLimit).toBe(999);
    expect(updatedEvent.isArchived).toBe(true);

    expect(
      await eventService["dbService"].db
        .select()
        .from(eventTable)
        .where(eq(eventTable.id, "birthday-1"))
        .then(rows => rows?.[0]?.name)
    ).toBe("Not birthday");
  });

  it("Should flush after updating event", async () => {
    const flush = vi.spyOn(DatabaseService.prototype, "flush");

    await eventService.createEvent({ name: "newEvent", startDate: NOW, endDate: NOW });

    expect(flush).toHaveBeenCalledOnce();
  });
});

describe("eventService deleteEvent", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "delete").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await eventService.deleteEvent("birthday-1"));
  });
});
