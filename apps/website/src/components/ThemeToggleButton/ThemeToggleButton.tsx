"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import styles from "./ThemeToggleButton.module.css";

/**
 * Renders a button allowing users to switch between light and dark mode.
 * Uses the resolved theme to display the next theme that will be applied.
 */

const ThemeToggleButton = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const nextTheme = resolvedTheme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.button}
      aria-label={`Switch theme to ${nextTheme.toUpperCase()}`}
    >
      {resolvedTheme === "dark" ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
