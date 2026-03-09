"use client";
import { makeRequest } from "@/lib/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const authTokenSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
});

type AuthTokenResponse = z.infer<typeof authTokenSchema>;

/**
 * Logs in with a password via POST /api/auth/login.
 * On success, returns an access token + expiry.
 * A refresh token is set automatically via HttpOnly cookie by the server.
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ password }: { password: string }) =>
      makeRequest(authTokenSchema, "/api/auth/login", "POST", { password }),
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
    mutationFn: () =>
      makeRequest(z.object({ ok: z.literal(true) }), "/api/auth/logout", "POST"),
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
    mutationFn: () => makeRequest(authTokenSchema, "/api/auth/refresh", "POST"),
  });
}
