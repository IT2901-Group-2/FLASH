import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { Result } from "typescript-result";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getEventCookie, getEventCookies, setEventCookie } from "./eventCookie";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { EventCookie, User } from "@/db";

const JWT_KEY = "SECRET_KEY";

type Cookie = { name: string; value?: unknown };

const mockUser1: User = {
  id: "userid1",
  name: "user1",
  eventId: "eventid1",
  isModerator: false,
  joinedAt: new Date(),
  lastAccessedAt: new Date(),
};

const validCookieRaw1: EventCookie = {
  name: "user1",
  userId: "userid1",
  eventId: "event1",
  isModerator: false,
};

const validCookie1: Cookie = {
  name: "event-eventid1",
  value: jwt.sign(validCookieRaw1, JWT_KEY),
};

const mockUser2: User = {
  id: "userid2",
  name: "user2",
  eventId: "eventid2",
  isModerator: true,
  joinedAt: new Date(),
  lastAccessedAt: new Date(),
};

const validCookieRaw2: EventCookie = {
  name: "user2",
  userId: "userid2",
  eventId: "event2",
  isModerator: true,
};

const validCookie2: Cookie = {
  name: "event-eventid2",
  value: jwt.sign(validCookieRaw2, JWT_KEY),
};

const invalidCookie1: Cookie = {
  name: "event-eventid2",
  value: jwt.sign(
    {
      name: "user2",
      userId: "userid2",
      eventId: "event2",
      isModerator: true,
    },
    "WRONG_KEY"
  ),
};

const invalidCookie2: Cookie = {
  name: "event-eventid2",
  value: "GARBAGE",
};

const invalidCookie3: Cookie = {
  name: "WRONG_NAME",
  value: {
    name: "user2",
    userId: "userid2",
    eventId: "event2",
    isModerator: true,
  },
};

const allCookies: RequestCookie[] = [
  validCookie1,
  validCookie2,
  invalidCookie1,
  invalidCookie2,
  invalidCookie3,
] as never;

const getAllMock = vi.fn();
const getMock = vi.fn();
const setMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    getAll: getAllMock,
    get: getMock,
    set: setMock,
  })),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getEventCookies", () => {
  it("Should return Err if cookies throw", async () => {
    vi.mocked(cookies).mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await getEventCookies("secret"));
  });

  it("Should correctly validate and return cookies", async () => {
    getAllMock.mockImplementationOnce(() => allCookies);

    expect(await getEventCookies(JWT_KEY).getOrThrow()).toStrictEqual([
      validCookieRaw1,
      validCookieRaw2,
    ]);
  });
});

describe("getEventCookie", () => {
  it("Should return Err if cookies throw", async () => {
    vi.mocked(cookies).mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await getEventCookie("eventid", "secret"));
  });

  it("Should correctly validate and return cookies", async () => {
    getMock
      .mockImplementationOnce(() => validCookie1 as never)
      .mockImplementationOnce(() => validCookie2 as never)
      .mockImplementationOnce(() => invalidCookie1 as never)
      .mockImplementationOnce(() => invalidCookie2 as never)
      .mockImplementationOnce(() => invalidCookie3 as never);

    expect(await getEventCookie(validCookie1.name, JWT_KEY).getOrThrow()).toStrictEqual(
      validCookieRaw1
    );
    expect(await getEventCookie(validCookie2.name, JWT_KEY).getOrThrow()).toStrictEqual(
      validCookieRaw2
    );
    Result.assertError(await getEventCookie(invalidCookie1.name, JWT_KEY));
    Result.assertError(await getEventCookie(invalidCookie2.name, JWT_KEY));
    Result.assertError(await getEventCookie(invalidCookie3.name, JWT_KEY));
  });
});

describe("setEventCookie", () => {
  it("Should return Err if cookies throw", async () => {
    vi.mocked(cookies).mockImplementationOnce(() => {
      throw new Error();
    });

    Result.assertError(await setEventCookie(mockUser1, JWT_KEY));
  });

  it("Should correctly set cookies", async () => {
    Result.assertOk(await setEventCookie(mockUser1, JWT_KEY));
    expect(setMock).toHaveBeenCalledOnce();

    Result.assertOk(await setEventCookie(mockUser2, JWT_KEY));
    expect(setMock).toHaveBeenCalledTimes(2);
  });
});
