import { useCallback, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation"; // your next-intl router
import { useSearchParams } from "next/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export interface UseLanguageReturn {
  locales: readonly string[];
  currentLocale: string;
  nextLocale: string | undefined;
  switchLocale: () => void;
}

/**
 * Custom hook to manage language switching using next-intl.
 *
 * It provides the current locale, the next locale to switch to, and a function
 * to perform the switch. The switchLocale function uses Next.js's router to
 * replace the current URL with the same path and query parameters, but with
 * the new locale. It also uses startTransition to avoid blocking the UI during
 * the switch.
 *
 * @returns An object containing the `list of locales`, the `current locale`, the
 * `next locale`, and the `switchLocale` function.
 *
 * @example
 * const { currentLocale, switchLocale } = useLanguage();
 * return (<button onClick={switchLocale}>
 *   Switch to {currentLocale === 'en' ? 'French' : 'English'}
 * </button>
 * );
 */
export const useLanguage = (): UseLanguageReturn => {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLocale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  const nextLocale = routing.locales.find(l => l !== currentLocale);

  const switchLocale = useCallback(() => {
    if (isPending || !nextLocale) return;
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(href, { locale: nextLocale });
      router.refresh();
    });
  }, [isPending, nextLocale, pathname, router, searchParams]);

  return {
    locales: routing.locales,
    currentLocale,
    nextLocale,
    switchLocale,
  };
};
