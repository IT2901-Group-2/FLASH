// @vitest-environment node
import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import { DatabaseService } from "../databaseService";
import { Result } from "typescript-result";
import { EventService } from "../eventService";
import { Event, eventCodeTable, eventTable } from "@/db";
import { subDays, addDays, subHours, addHours, setMilliseconds } from "date-fns";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";

const NOW = setMilliseconds(new Date(), 0);

function getMockedEvent(data: Partial<Event> = {}): Event {
  return {
    id: "id",
    name: "name",
    description: "description",
    startDate: setMilliseconds(new Date(), 0),
    endDate: setMilliseconds(new Date(), 0),
    uploadLimit: 5,
    isArchived: false,
    createdAt: setMilliseconds(new Date(), 0),
    updatedAt: setMilliseconds(new Date(), 0),
    ...data,
  };
}

const mockEvents: Event[] = [
  {
    id: "birthday-1",
    name: "Birthday 1",
    description: "birthday event",
    startDate: subHours(NOW, 6),
    endDate: subHours(NOW, 5),
    uploadLimit: 5,
  },
  {
    id: "birthday-2",
    name: "Birthday 2",
    startDate: subHours(NOW, 2),
    endDate: addHours(NOW, 10),
    uploadLimit: 5,
    isArchived: true,
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
].map(getMockedEvent);

const mockGuestCodes: Record<string, string> = {
  "birthday-1": "birth1guest",
  "birthday-2": "birth2guest",
};

const mockModeratorCodes: Record<string, string> = {
  "birthday-1": "birth1mod",
  "birthday-2": "birth2mod",
};

let eventService: EventService;

beforeEach(async () => {
  const dbService = new DatabaseService({
    read: vi.fn(() => Result.error(new Error())),
    write: vi.fn(() => Result.ok()),
  } as never);
  await dbService.initialize().getOrThrow();

  await dbService.db.insert(eventTable).values(mockEvents);
  await Promise.all(
    mockEvents.map(async e => {
      await dbService.db
        .insert(eventCodeTable)
        .values({ eventId: e.id, code: mockModeratorCodes[e.id], isModerator: true });
      await dbService.db
        .insert(eventCodeTable)
        .values({ eventId: e.id, code: mockGuestCodes[e.id], isModerator: false });
    })
  );

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
        .getEvents({ status: "finished", name: "1" })
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

  it("Should correctly sort by name", async () => {
    expect(
      await eventService
        .getEvents({ sortBy: "name", order: "ascending" })
        .map(rows => rows.map(row => row.name))
        .getOrThrow()
    ).toStrictEqual(mockEvents.map(e => e.name).sort());
    expect(
      await eventService
        .getEvents({ sortBy: "name", order: "descending" })
        .map(rows => rows.map(row => row.name))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents
        .map(e => e.name)
        .sort()
        .reverse()
    );
  });

  it("Should correctly sort by description", async () => {
    expect(
      await eventService
        .getEvents({ sortBy: "description", order: "ascending" })
        .map(rows => rows.map(row => row.description))
        .getOrThrow()
    ).toStrictEqual(mockEvents.map(e => e.description).sort());
    expect(
      await eventService
        .getEvents({ sortBy: "description", order: "descending" })
        .map(rows => rows.map(row => row.description))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents
        .map(e => e.description)
        .sort()
        .reverse()
    );
  });

  it("Should correctly sort by startDate", async () => {
    expect(
      await eventService
        .getEvents({ sortBy: "startDate", order: "ascending" })
        .map(rows => rows.map(row => row.startDate))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents.map(e => e.startDate).sort((a, b) => a.getTime() - b.getTime())
    );
    expect(
      await eventService
        .getEvents({ sortBy: "startDate", order: "descending" })
        .map(rows => rows.map(row => row.startDate))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents
        .map(e => e.startDate)
        .sort((a, b) => a.getTime() - b.getTime())
        .reverse()
    );
  });

  it("Should correctly sort by endDate", async () => {
    expect(
      await eventService
        .getEvents({ sortBy: "endDate", order: "ascending" })
        .map(rows => rows.map(row => row.endDate))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents.map(e => e.endDate).sort((a, b) => a.getTime() - b.getTime())
    );
    expect(
      await eventService
        .getEvents({ sortBy: "endDate", order: "descending" })
        .map(rows => rows.map(row => row.endDate))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents
        .map(e => e.endDate)
        .sort((a, b) => a.getTime() - b.getTime())
        .reverse()
    );
  });

  it("Should correctly sort by upload limit", async () => {
    expect(
      await eventService
        .getEvents({ sortBy: "uploadLimit", order: "ascending" })
        .map(rows => rows.map(row => row.uploadLimit))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents
        .map(e => e.uploadLimit)
        .sort((a, b) => (a === null || b === null ? 0 : a - b))
    );
    expect(
      await eventService
        .getEvents({ sortBy: "uploadLimit", order: "descending" })
        .map(rows => rows.map(row => row.uploadLimit))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents
        .map(e => e.uploadLimit)
        .sort((a, b) => (a === null || b === null ? 0 : a - b))
        .reverse()
    );
  });

  it("Should correctly sort by createdAt", async () => {
    expect(
      await eventService
        .getEvents({ sortBy: "createdAt", order: "ascending" })
        .map(rows => rows.map(row => row.createdAt))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents.map(e => e.createdAt).sort((a, b) => a.getTime() - b.getTime())
    );
    expect(
      await eventService
        .getEvents({ sortBy: "createdAt", order: "descending" })
        .map(rows => rows.map(row => row.createdAt))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents
        .map(e => e.createdAt)
        .sort((a, b) => a.getTime() - b.getTime())
        .reverse()
    );
  });

  it("Should correctly sort by updatedAt", async () => {
    expect(
      await eventService
        .getEvents({ sortBy: "updatedAt", order: "ascending" })
        .map(rows => rows.map(row => row.updatedAt))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents.map(e => e.updatedAt).sort((a, b) => a.getTime() - b.getTime())
    );
    expect(
      await eventService
        .getEvents({ sortBy: "updatedAt", order: "descending" })
        .map(rows => rows.map(row => row.updatedAt))
        .getOrThrow()
    ).toStrictEqual(
      mockEvents
        .map(e => e.updatedAt)
        .sort((a, b) => a.getTime() - b.getTime())
        .reverse()
    );
  });
});

describe("eventService getEventCode", () => {
  it("Should return Err when database call fails", async () => {
    vi.spyOn(BetterSQLite3Database.prototype, "select").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await eventService.getEventCode("birthday-1", { role: "guest" }));
  });

  it("Should correctly return guest code", async () => {
    expect(
      await eventService.getEventCode("birthday-1", { role: "guest" }).getOrThrow()
    ).toBe("birth1guest");

    expect(
      await eventService.getEventCode("birthday-2", { role: "guest" }).getOrThrow()
    ).toBe("birth2guest");
  });

  it("Should correctly return moderator code", async () => {
    expect(
      await eventService.getEventCode("birthday-1", { role: "moderator" }).getOrThrow()
    ).toBe("birth1mod");

    expect(
      await eventService.getEventCode("birthday-2", { role: "moderator" }).getOrThrow()
    ).toBe("birth2mod");
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

  it("Should return Err and clean up event when code insert fails", async () => {
    const deleteSpy = vi.spyOn(BetterSQLite3Database.prototype, "delete");
    const originalInsert = BetterSQLite3Database.prototype.insert;
    vi.spyOn(BetterSQLite3Database.prototype, "insert")
      .mockImplementationOnce(originalInsert)
      .mockImplementationOnce(() => {
        throw new Error();
      });

    Result.assertError(
      await eventService.createEvent({
        name: "newEvent",
        startDate: NOW,
        endDate: NOW,
      })
    );

    expect(deleteSpy).toHaveBeenCalledOnce();
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

    const codes = await eventService["dbService"].db
      .select()
      .from(eventCodeTable)
      .where(eq(eventCodeTable.eventId, newEvent.id));
    expect(codes).toHaveLength(2);
    expect(new Set(codes.map(c => c.isModerator))).toStrictEqual(new Set([true, false]));
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

    await eventService.updateEvent("birthday-1", { description: "new desc" });

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

  it("Should correctly delete event", async () => {
    const deletedEvent = await eventService.deleteEvent("birthday-1").getOrThrow();

    expect(deletedEvent.name).toBe("Birthday 1");
    expect(deletedEvent.description).toBe("birthday event");
    expect(deletedEvent.uploadLimit).toBe(5);
    expect(deletedEvent.isArchived).toBe(false);

    expect(
      await eventService["dbService"].db
        .select()
        .from(eventTable)
        .then(rows => new Set(rows.map(row => row.id)))
    ).toStrictEqual(
      new Set(["birthday-2", "wedding-1", "wedding-2", "lowercase-1", "uppercase-1"])
    );
  });

  it("Should flush after deleting event", async () => {
    const flush = vi.spyOn(DatabaseService.prototype, "flush");

    await eventService.deleteEvent("birthday-1");

    expect(flush).toHaveBeenCalledOnce();
  });
});
