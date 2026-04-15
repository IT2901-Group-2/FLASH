import { Auth } from "@/actions/auth";
import { makeAuth } from "../factories/auth.factory";
import { mockQueryResult } from "./useQuery.mock";
import { UseQueryResult } from "@tanstack/react-query";

export const defaultAuthQueryReturn: UseQueryResult<Auth> = mockQueryResult({
  data: makeAuth(),
});

/**
 * Successful `useAuth` result with the gived auth state.
 */
export const mockAuthLoaded = (auth?: Partial<Auth>): UseQueryResult<Auth> =>
  mockQueryResult({ data: makeAuth(auth) });
