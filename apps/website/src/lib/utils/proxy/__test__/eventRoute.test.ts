import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { Result } from "typescript-result";
import {
  checkEventCookie,
  isModerator,
  getEventId,
  isEventRoute,
  isModerateRoute,
} from "../eventRoute";
import { getEventCookie } from "@/lib/utils/eventCookie";

const deleteCookieMock = vi.fn();
vi.mock("next/headers", () => ({ cookies: vi.fn(() => ({ delete: deleteCookieMock })) }));

const getEventCookieMock = vi.mocked(getEventCookie);
vi.mock(
  "@/lib/utils/eventCookie",
  vi.fn(() => ({ getEventCookie: vi.fn() }))
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isEventRoute", () => {
  it("Should correctly match event routes", () => {
    expect(
      isEventRoute(new NextRequest("http://www.test.com/en/not-events/not-eventId"))
    ).toBe(false);
    expect(isEventRoute(new NextRequest("http://www.test.com/en/events/"))).toBe(false);
    expect(isEventRoute(new NextRequest("http://www.test.com/events/a"))).toBe(false);
    expect(
      isEventRoute(new NextRequest("https://www.test.com/en/not-events/events/event-id"))
    ).toBe(false);
    expect(isEventRoute(new NextRequest("http://www.test.com/en/events/a"))).toBe(true);
    expect(
      isEventRoute(new NextRequest("http://www.test.com/no/events/eventId/moderate"))
    ).toBe(true);
  });
});

describe("getEventId", () => {
  it("Should throw when not in event route", () => {
    expect(() =>
      getEventId(new NextRequest("http://www.test.com/en/not-events/not-eventId"))
    ).toThrow();
    expect(() => getEventId(new NextRequest("http://www.test.com/en/events/"))).toThrow();
    expect(() => getEventId(new NextRequest("http://www.test.com/events/a"))).toThrow();
    expect(() =>
      getEventId(new NextRequest("https://www.test.com/en/not-events/events/event-id"))
    ).toThrow();
  });

  it("Should correctly return the eventId", () => {
    expect(getEventId(new NextRequest("http://www.test.com/en/events/a"))).toBe("a");
    expect(
      getEventId(new NextRequest("http://www.test.com/no/events/eventId/moderate"))
    ).toBe("eventId");
  });
});

describe("isModerateRoute", () => {
  it("Should correctly match moderate routes", () => {
    expect(
      isModerateRoute(new NextRequest("http://www.test.com/en/events/abc/moderate"))
    ).toBe(true);
    expect(
      isModerateRoute(new NextRequest("http://www.test.com/no/events/eventId/moderate"))
    ).toBe(true);
  });

  it("Should not match non-moderate routes", () => {
    expect(isModerateRoute(new NextRequest("http://www.test.com/en/events/abc"))).toBe(false);
    expect(
      isModerateRoute(new NextRequest("http://www.test.com/en/events/abc/moderate/extra"))
    ).toBe(false);
    expect(
      isModerateRoute(new NextRequest("http://www.test.com/en/events/abc/slideshow"))
    ).toBe(false);
    expect(
      isModerateRoute(new NextRequest("http://www.test.com/en/not-events/abc/moderate"))
    ).toBe(false);
  });
});

describe("isModerator", () => {
  it("Should return true when cookie has isModerator true", async () => {
    getEventCookieMock.mockImplementationOnce(() =>
      Result.fromAsync(async () => ({ isModerator: true }) as never)
    );

    expect(await isModerator("eventId")).toBe(true);
  });

  it("Should return false when cookie has isModerator false", async () => {
    getEventCookieMock.mockImplementationOnce(() =>
      Result.fromAsync(async () => ({ isModerator: false }) as never)
    );

    expect(await isModerator("eventId")).toBe(false);
  });

  it("Should return false when cookie is invalid or missing", async () => {
    getEventCookieMock.mockImplementationOnce(() =>
      Result.fromAsyncCatching(async () => {
        throw new Error();
      })
    );

    expect(await isModerator("eventId")).toBe(false);
  });
});

describe("checkEventCookie", () => {
  it("Should return true on valid cookie", async () => {
    getEventCookieMock.mockImplementationOnce(() =>
      Result.fromAsync(async () => null as never)
    );

    expect(await checkEventCookie("eventId")).toBe(true);
    expect(deleteCookieMock).not.toHaveBeenCalledOnce();
  });

  it("Should return false and delete invalid cookie", async () => {
    getEventCookieMock.mockImplementationOnce(() =>
      Result.fromAsyncCatching(async () => {
        throw new Error();
      })
    );

    expect(await checkEventCookie("eventId")).toBe(false);
    expect(deleteCookieMock).toHaveBeenCalledOnce();
  });
});
