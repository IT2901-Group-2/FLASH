import { ResolvedTheme, Theme, THEME_STORAGE_KEY } from "@/providers/ThemeProvider";

export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyTheme = (resolvedTheme: ResolvedTheme) => {
  if (typeof document === "undefined") return;
  document.body.setAttribute("data-theme", resolvedTheme);
};

export const getStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  return (stored as Theme) ?? null;
};

export const setStoredTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const systemThemeListner = (theme: Theme) => {
  if (theme !== "system") return;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    applyTheme(getSystemTheme());
  });
};
