"use server";

import { PropsWithChildren } from "react";
import { Auth, AuthContextProvider } from "./AuthContext";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/utils/auth";
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

export async function AuthProvider({ children }: PropsWithChildren) {
  const authPromise = getAuth();

  return <AuthContextProvider value={authPromise}>{children}</AuthContextProvider>;
}
