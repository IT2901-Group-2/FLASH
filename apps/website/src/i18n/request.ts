import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const messageNamespaces = ["common", "pages", "admin", "guest"] as const;

/**
 * This file is responsible for loading the correct locale and messages
 * based on request.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const loadedNamespaces = await Promise.all(
    messageNamespaces.map(
      namespace => import(`../../messages/locales/${locale}/${namespace}.json`)
    )
  );

  const messages = Object.fromEntries(
    messageNamespaces.map((namespace, index) => [
      namespace,
      loadedNamespaces[index]?.default,
    ])
  );

  return {
    locale,
    messages,
  };
});
