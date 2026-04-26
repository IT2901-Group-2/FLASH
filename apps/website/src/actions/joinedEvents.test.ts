import { getEventCookies } from "@/lib/utils/eventCookie";
import { makeJoinedEvent } from "@test-config";
import { Result } from "typescript-result";
import { describe, expect, it, vi } from "vitest";
import { getJoinedEvents } from "./joinedEvents";

vi.mock("@/lib/utils/eventCookie", () => ({ getEventCookies: vi.fn() }));
vi.mock("@/config", () => ({ JWT_SECRET: "test-secret" }));

describe("getJoinedEvents", () => {
  it("returns events with userId stripped out", async () => {
    vi.mocked(getEventCookies).mockReturnValue(
      Result.try(async () =>
        // To see that `isModerator` does not effect it
        [true, false].map(bool => ({
          userId: "user-1",
          ...makeJoinedEvent({ isModerator: bool }),
        }))
      )
    );

    const result = await getJoinedEvents();

    expect(result).toHaveLength(2);
    result.forEach(event => {
      expect(event).not.toHaveProperty("userId");
    });
  });

  it("preserves all JoinedEvent fields", async () => {
    const joined = makeJoinedEvent();
    vi.mocked(getEventCookies).mockReturnValue(
      Result.try(async () => [{ userId: "user-1", ...joined }])
    );

    const result = await getJoinedEvents();
    expect(result[0]).toEqual(joined);
  });

  it("passes JWT_SECRET to getEventCookies", async () => {
    vi.mocked(getEventCookies).mockReturnValue(Result.try(async () => []));
    await getJoinedEvents();
    expect(getEventCookies).toHaveBeenCalledWith("test-secret");
  });

  it("returns an empty array when getEventCookies fails", async () => {
    vi.mocked(getEventCookies).mockReturnValue(
      Result.try(async () => {
        throw new Error("cookie parse failed");
      })
    );

    const result = await getJoinedEvents();
    expect(result).toEqual([]);
  });

  it("returns an empty array when there are no event cookies", async () => {
    vi.mocked(getEventCookies).mockReturnValue(Result.try(async () => []));
    const result = await getJoinedEvents();
    expect(result).toEqual([]);
  });
});
