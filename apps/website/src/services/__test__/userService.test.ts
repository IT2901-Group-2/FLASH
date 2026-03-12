import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "../userService";
import { getEventCookie, setEventCookie } from "@/lib/utils/eventCookie";
import fs from "fs/promises";
import upath from "upath";
import { tmpdir } from "os";
import { FSStorage } from "file-storage";
import { DatabaseService } from "../databaseService";
import { eventCodeTable, eventTable, userTable } from "@/db";
import { Result } from "typescript-result";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { EventService } from "../eventService";
import { HTTPError } from "@/lib/utils/error";

vi.mock("@/lib/utils/eventCookie");
const mockedGetEventCookie = vi.mocked(getEventCookie);
const mockedSetEventCookie = vi.mocked(setEventCookie);

const mockEvent: typeof eventTable.$inferInsert = {
  id: "mock-event",
  name: "Mock event",
  startDate: new Date(),
  endDate: new Date(),
};

const mockGuestCode: typeof eventCodeTable.$inferInsert = {
  code: "guest-code",
  eventId: "mock-event",
  isModerator: false,
};

const mockModeratorCode: typeof eventCodeTable.$inferInsert = {
  code: "moderator-code",
  eventId: "mock-event",
  isModerator: true,
};

let tmpDir: string;
let userService: UserService;

beforeEach(async () => {
  vi.clearAllMocks();
  tmpDir = await fs.mkdtemp(upath.join(tmpdir(), "test-imageService-"));
  const storage = new FSStorage(tmpDir);
  const dbService = new DatabaseService(storage);
  await dbService.initialize().getOrThrow();
  userService = new UserService(dbService, new EventService(dbService));

  await dbService.db.insert(eventTable).values(mockEvent);
  await dbService.db.insert(eventCodeTable).values([mockGuestCode, mockModeratorCode]);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true });
  vi.restoreAllMocks();
});

describe("userService joinEvent", () => {
  it("Should return Err when code is invalid", async () => {
    Result.assertError(
      await userService.joinEvent({ name: "test", eventCode: "jkahdla" })
    );
  });

  it("Should return early if cookie already exists", async () => {
    mockedGetEventCookie.mockImplementationOnce(() =>
      Result.fromAsync(async () => null as never)
    );

    expect(
      await userService.joinEvent({ name: "test", eventCode: "guest-code" }).getOrThrow()
    ).toBe("mock-event");

    expect(mockedSetEventCookie).not.toHaveBeenCalled();
  });

  it("Should return Err when user creation fails", async () => {
    mockedGetEventCookie.mockImplementationOnce(() =>
      Result.fromAsyncCatching(async () => {
        throw new Error();
      })
    );
    vi.spyOn(BetterSQLite3Database.prototype, "insert").mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(
      await userService.joinEvent({ name: "test", eventCode: "guest-code" })
    );
  });

  it("Should return 409 error when nickname is already taken", async () => {
    vi.spyOn(DatabaseService.prototype, "flush").mockImplementation(vi.fn());
    mockedGetEventCookie.mockImplementation(() =>
      Result.fromAsyncCatching(async () => {
        throw new Error();
      })
    );
    mockedSetEventCookie.mockImplementation(() => Result.fromAsync(async () => {}));

    await userService.joinEvent({ name: "test1", eventCode: "guest-code" }).getOrThrow();

    const duplicateResult = await userService.joinEvent({
      name: "test1",
      eventCode: "guest-code",
    });
    Result.assertError(duplicateResult);
    const duplicateError = duplicateResult.error as HTTPError;

    expect(duplicateError).toBeInstanceOf(HTTPError);
    expect(duplicateError.code).toBe(409);
    expect(duplicateError.json).toEqual({
      code: "NICKNAME_TAKEN",
      message: "Nickname is already taken",
    });
  });

  it("Should join event successfully", async () => {
    const flush = vi
      .spyOn(DatabaseService.prototype, "flush")
      .mockImplementation(vi.fn());
    mockedGetEventCookie.mockImplementation(() =>
      Result.fromAsyncCatching(async () => {
        throw new Error();
      })
    );
    mockedSetEventCookie.mockImplementation(() => Result.fromAsync(async () => {}));

    expect(
      await userService.joinEvent({ name: "test1", eventCode: "guest-code" }).getOrThrow()
    ).toBe("mock-event");

    expect(mockedSetEventCookie).toHaveBeenCalledOnce();
    expect(flush).toHaveBeenCalledOnce();

    expect(
      await userService
        .joinEvent({ name: "test2", eventCode: "moderator-code" })
        .getOrThrow()
    ).toBe("mock-event");

    expect(mockedSetEventCookie).toHaveBeenCalledTimes(2);
    expect(flush).toHaveBeenCalledTimes(2);

    expect(
      await userService["dbService"].db
        .select()
        .from(userTable)
        .then(rows => new Set(rows.map(row => row.name)))
    ).toStrictEqual(new Set(["test1", "test2"]));
  });
});
