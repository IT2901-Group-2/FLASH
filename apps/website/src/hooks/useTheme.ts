import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "@/providers/ThemeProvider";

/**
 * Hook to access theme functions and values.
 * {@link ThemeContextValue}
 */
export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
