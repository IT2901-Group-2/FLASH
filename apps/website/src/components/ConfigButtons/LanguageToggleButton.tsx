"use client";
import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./ConfigButtons.module.css";

type Locale = (typeof routing.locales)[number];

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
  const [isSwitching, setIsSwitching] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLocale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  const nextLocale = routing.locales.find(l => l !== currentLocale);

  const handleSwitch = useCallback(() => {
    if (isSwitching || !nextLocale) return;

    setIsSwitching(true);

    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.replace(href, { locale: nextLocale });
    router.refresh();
  }, [isSwitching, nextLocale, pathname, router, searchParams]);

  if (!nextLocale) return null;

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={isSwitching}
      className={`${styles.button} ${styles.right}`}
      aria-label={`Current language: ${currentLocale.toUpperCase()}. Switch to ${nextLocale.toUpperCase()}`}
      aria-busy={isSwitching}
    >
      <Languages size={16} aria-hidden="true" />
      <span lang={nextLocale}>{nextLocale.toUpperCase()}</span>
    </button>
  );
};

export default LanguageToggleButton;
