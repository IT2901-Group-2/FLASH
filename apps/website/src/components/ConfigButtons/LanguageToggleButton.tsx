"use client";
import { Languages } from "lucide-react";
import styles from "./ConfigButtons.module.css";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Renders a button allowing users to switch between available locales.
 * Uses the active i18n locale to determine the next locale to switch to.
 * When the button is clicked, it redirects the user to the translated version of the current page.
 *
 * Suitable for our current setup with only two locales, but will need to be tweaked if more locales are added in the future.
 *
 * > _Last updated: `2026-03-18`_
 */
const LanguageToggleButton = () => {
  const { isSwitching, nextLocale, switchLocale } = useLanguage();

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={isSwitching}
      className={`${styles.button} ${styles.right}`}
      aria-label={`Switch to ${nextLocale?.toUpperCase()}`}
      aria-busy={isSwitching}
    >
      <Languages size={16} aria-hidden="true" />
      <span lang={nextLocale}>{nextLocale?.toUpperCase()}</span>
    </button>
  );
};

export default LanguageToggleButton;
