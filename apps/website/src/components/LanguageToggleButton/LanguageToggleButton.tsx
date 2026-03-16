"use client";

import { useParams } from "next/navigation";
import { Languages } from "lucide-react";
import { routing } from "@/i18n/routing";
import styles from "./LanguageToggleButton.module.css";

type Locale = (typeof routing.locales)[number];

/**
 * Renders a button allowing users to switch between available locales.
 * Employs `useParams` to determine current locale from the URL and find the next locale to switch to.
 * When the button is clicked, it redirects the user to the new locale.
 *
 * Suitable for our current setup with only two locales, but will need to be tweaked if more locales are added in the future.
 * Will also need some handling of paths if implemented outside the "Login" pages
 */
const LanguageToggleButton = () => {
  const params = useParams<{ locale?: string }>();

  const currentLocale = routing.locales.includes(params.locale as Locale)
    ? (params.locale as Locale)
    : routing.defaultLocale;

  const nextLocale = routing.locales.find(l => l !== currentLocale) as Locale;

  const handleSwitch = () => {
    window.location.assign(`/${nextLocale}`);
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className={styles.button}
      aria-label={`Switch language to ${nextLocale.toUpperCase()}`}
    >
      <Languages size={16} aria-hidden="true" />
      <span>{nextLocale.toUpperCase()}</span>
    </button>
  );
};

export default LanguageToggleButton;
