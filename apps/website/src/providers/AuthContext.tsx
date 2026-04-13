"use client";

import { ComponentProps } from "react";
import { createContext, use, useContext } from "react";

export type Auth = {
  isAdmin: boolean;
};

export const AuthContext = createContext<Promise<Auth> | null>(null);

export const AuthContextProvider = (
  props: ComponentProps<typeof AuthContext.Provider>
) => <AuthContext.Provider {...props} />;

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error("useAuth has to be used within an AuthProvider");
  }

  return use(auth);
}
