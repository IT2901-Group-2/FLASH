import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { Result } from "typescript-result";
import { checkEventCookie, getEventId, isEventRoute } from "../eventRoute";
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
