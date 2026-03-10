import { afterEach, describe, expect, it, vi } from "vitest";
import { getEventByCode, getJoinCode, isJoinRoute } from "../joinRoute";
import { NextRequest } from "next/server";
import { makeRequest } from "@/lib/utils/api";

const makeRequestMock = vi.mocked(makeRequest);
vi.mock(
  "@/lib/utils/api",
  vi.fn(() => ({ makeRequest: vi.fn() }))
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isJoinRoute", () => {
  it("Should correctly match join routes", () => {
    expect(isJoinRoute(new NextRequest("http://www.test.com/en/not-join/not-code"))).toBe(
      false
    );
    expect(isJoinRoute(new NextRequest("http://www.test.com/en/join/"))).toBe(false);
    expect(isJoinRoute(new NextRequest("http://www.test.com/join/a"))).toBe(false);
    expect(isJoinRoute(new NextRequest("http://www.test.com/en/join/a"))).toBe(true);
    expect(isJoinRoute(new NextRequest("http://www.test.com/no/join/code/abcd"))).toBe(
      true
    );
  });
});

describe("getJoinCode", () => {
  it("Should throw when not in join route", () => {
    expect(() =>
      getJoinCode(new NextRequest("http://www.test.com/en/not-join/not-code"))
    ).toThrow();
    expect(() => getJoinCode(new NextRequest("http://www.test.com/en/join/"))).toThrow();
    expect(() => getJoinCode(new NextRequest("http://www.test.com/join/a"))).toThrow();
  });

  it("Should correctly return the join code", () => {
    expect(getJoinCode(new NextRequest("http://www.test.com/en/join/a"))).toBe("a");
    expect(
      getJoinCode(new NextRequest("http://www.test.com/no/join/joinCode/abcd"))
    ).toBe("joinCode");
  });
});

describe("getEventByCode", () => {
  it("Should return null when join code is invalid", async () => {
    makeRequestMock.mockImplementationOnce(async () => {
      throw new Error();
    });

    expect(await getEventByCode(new NextRequest("https://test"), "code")).toBeNull();
  });

  it("Should return eventId then join code is valid", async () => {
    makeRequestMock.mockImplementationOnce(async () => ({ eventId: "event-id" }));

    expect(await getEventByCode(new NextRequest("https://test"), "code")).toBe(
      "event-id"
    );
  });
});
