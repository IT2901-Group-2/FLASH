"use client";
import { useEffect } from "react";
import { useRefreshMutation } from "@/hooks/useAuth";
import { registerRefresh } from "@/lib/utils/authstore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refresh } = useRefreshMutation();

  useEffect(() => {
    registerRefresh(refresh);
  }, [refresh]);

  return <>{children}</>;
}
