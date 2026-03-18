"use client";

import { Moon, Sun } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useTheme } from "@/hooks/useTheme";
import styles from "./ThemeToggleButton.module.css";

/**
 * Renders a button allowing users to switch between light and dark mode.
 * Uses the resolved theme to display the next theme that will be applied.
 *
 * > _Last updated: `2026-03-18`_
 */

const ThemeToggleButton = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useIsMounted();

  const nextTheme = mounted ? (resolvedTheme === "light" ? "dark" : "light") : "dark";
  const showSunIcon = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.button}
      aria-label={`Switch theme to ${nextTheme.toUpperCase()}`}
    >
      {showSunIcon ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
