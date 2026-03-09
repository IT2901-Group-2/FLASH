"use client";

import { fetchJson } from "@/lib/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AuthTokenResponse = {
  accessToken: string;
  expiresIn: number;
};

/**
 * Logs in with a password via POST /api/auth/login.
 * On success, returns an access token + expiry.
 * A refresh token is set automatically via HttpOnly cookie by the server.
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ password }: { password: string }) =>
      fetchJson<AuthTokenResponse>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }),
  });
}

/**
 * Logs out the current user via POST /api/auth/logout.
 * The server clears the HttpOnly refresh token cookie.
 * All cached queries are invalidated on success.
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchJson<{ ok: true }>("/api/auth/logout", { method: "POST" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

/**
 * Refreshes the access token via POST /api/auth/refresh.
 * Relies on the HttpOnly refresh token cookie being present.
 * Returns a new access token + expiry.
 */
export function useRefreshMutation() {
  return useMutation({
    mutationFn: () =>
      fetchJson<AuthTokenResponse>("/api/auth/refresh", { method: "POST" }),
  });
}
