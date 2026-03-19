"use client";
import { makeRequest } from "@/lib/utils/api";
import { AuthState } from "@/lib/utils/auth";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { z } from "zod";

const okSchema = z.object({ ok: z.literal(true) });

/**
 * Attempts a token refresh on mount to restore session state.
 * staleTime: infinity prevents background refetches - auth state is
 * managed manually via setQueryData from mutations.
 */
export function useAuth(): UseQueryResult<AuthState, Error> {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await makeRequest(okSchema, "/api/auth/refresh", "POST");
      return res ?? null;
    },
    staleTime: Infinity,
  });
}

/**
 * Logs in with a password via POST /api/auth/login.
 * On success, marks auth state as ok.
 * A refresh token is set automatically via HttpOnly cookie by the server.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ password }: { password: string }) =>
      makeRequest(okSchema, "/api/auth/login", "POST", { password }),
    onSuccess: data => {
      queryClient.setQueryData(["auth"], data);
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
    mutationFn: () => makeRequest(okSchema, "/api/auth/logout", "POST"),
    onSuccess: async () => {
      queryClient.setQueryData(["auth"], null);
    },
  });
}

/**
 * Refreshes the access token via POST /api/auth/refresh.
 * Relies on the HttpOnly refresh token cookie being present.
 * Clears auth state on failure.
 */
export function useRefreshMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => makeRequest(okSchema, "/api/auth/refresh", "POST"),
    onSuccess: data => {
      queryClient.setQueryData(["auth"], data);
    },
    onError: () => {
      queryClient.setQueryData(["auth"], null);
    },
  });
  return { ...mutation, refresh: mutation.mutateAsync };
}
