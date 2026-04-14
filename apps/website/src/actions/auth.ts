"use server";

import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/utils/auth";
import { Result } from "typescript-result";

export type Auth = {
  isAdmin: boolean;
};

/**
 * Returns the authentication state of the user by checking for the existence
 * and validity of an acces or refresh token.
 *
 * @returns The auth state of the user.
 */
export async function getAuth(): Promise<Auth> {
  return Result.try(verifyAccessToken)
    .recoverCatching(() =>
      Result.try(verifyRefreshToken)
        .mapCatching(signAccessToken)
        .mapCatching(signRefreshToken)
    )
    .map(() => ({ isAdmin: true }))
    .getOrDefault({ isAdmin: false });
}
