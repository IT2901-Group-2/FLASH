import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/utils/auth";
import { describe, expect, it, vi } from "vitest";
import { getAuth } from "./auth";

vi.mock("@/lib/utils/auth", () => ({
  verifyAccessToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
}));

vi.mock("@/lib/utils/eventCookie", () => ({
  getEventCookies: vi.fn(),
}));
vi.mock("@/config", () => ({
  JWT_SECRET: "test-secret",
}));

describe("getAuth", () => {
  it("returns isAdmin: true when the access token is valid", async () => {
    vi.mocked(verifyAccessToken).mockReturnValue("payload" as never);
    const result = await getAuth();
    expect(result).toEqual({ isAdmin: true });
  });

  it("returns isAdmin: true when access token fails but refresh flow succeeds", async () => {
    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw new Error("expired");
    });
    vi.mocked(verifyRefreshToken).mockReturnValue("refresh-payload" as never);
    vi.mocked(signAccessToken).mockReturnValue("new-access" as never);
    vi.mocked(signRefreshToken).mockReturnValue("new-refresh" as never);

    const result = await getAuth();

    expect(result).toEqual({ isAdmin: true });
  });

  it("returns isAdmin: false when both access and refresh tokens are invalid", async () => {
    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw new Error("expired");
    });
    vi.mocked(verifyRefreshToken).mockImplementation(() => {
      throw new Error("invalid");
    });

    const result = await getAuth();
    expect(result).toEqual({ isAdmin: false });
  });

  it("returns isAdmin: false when refresh token is valid but signAccessToken throws", async () => {
    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw new Error("expired");
    });
    vi.mocked(verifyRefreshToken).mockReturnValue("refresh-payload" as never);
    vi.mocked(signAccessToken).mockImplementation(() => {
      throw new Error("sign failed");
    });

    const result = await getAuth();
    expect(result).toEqual({ isAdmin: false });
  });

  it("returns isAdmin: false when signRefreshToken throws", async () => {
    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw new Error("expired");
    });
    vi.mocked(verifyRefreshToken).mockReturnValue("refresh-payload" as never);
    vi.mocked(signAccessToken).mockReturnValue("new-access" as never);
    vi.mocked(signRefreshToken).mockImplementation(() => {
      throw new Error("sign failed");
    });

    const result = await getAuth();
    expect(result).toEqual({ isAdmin: false });
  });

  it("does not attempt the refresh flow when the access token is valid", async () => {
    vi.mocked(verifyAccessToken).mockReturnValue("payload" as never);
    await getAuth();
    expect(verifyRefreshToken).not.toHaveBeenCalled();
  });
});
