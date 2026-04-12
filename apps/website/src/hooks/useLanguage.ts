import { useCallback, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation"; // your next-intl router
import { useSearchParams } from "next/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export function useLanguage() {
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
}
