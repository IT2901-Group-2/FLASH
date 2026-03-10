"use client";
import { makeRequest } from "@/lib/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const authTokenSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
});

type AuthToken = z.infer<typeof authTokenSchema> | null;

/**
 * Returns the current auth token state.
 * Seeded as null — only updated via setQueryData from mutations.
 * staleTime: Infinity prevents background refetches on this client-only state.
 */
export function useAuth() {
  return useQuery<AuthToken>({
    queryKey: ["auth"],
    queryFn: async () => null,
    staleTime: Infinity,
  });
}

/**
 * Logs in with a password via POST /api/auth/login.
 * On success, returns an access token + expiry.
 * A refresh token is set automatically via HttpOnly cookie by the server.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ password }: { password: string }) =>
      makeRequest(authTokenSchema, "/api/auth/login", "POST", { password }),
    onSuccess: data => {
      queryClient.setQueryData<AuthToken>(["auth"], data);
    },
  });
}

/**
 * Logs out the current user via POST /api/auth/logout.
 * The server clears the HttpOnly refresh token cookie.
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      makeRequest(z.object({ ok: z.literal(true) }), "/api/auth/logout", "POST"),
    onSuccess: async () => {
      queryClient.setQueryData<AuthToken>(["auth"], null);
    },
  });
}

/**
 * Refreshes the access token via POST /api/auth/refresh.
 * Relies on the HttpOnly refresh token cookie being present.
 * Returns a new access token + expiry.
 */
export function useRefreshMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => makeRequest(authTokenSchema, "/api/auth/refresh", "POST"),
    onSuccess: data => {
      queryClient.setQueryData<AuthToken>(["auth"], data);
    },
  });
}
