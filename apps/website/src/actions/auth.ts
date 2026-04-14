"use server";

import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/utils/auth";
import { Auth } from "@/providers/AuthContext";
import { Result } from "typescript-result";

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
