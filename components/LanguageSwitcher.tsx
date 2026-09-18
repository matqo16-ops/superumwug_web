"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { getPathname, usePathname } from "@/i18n/navigation";
import { isGermanOnly, routing } from "@/i18n/routing";

// Offering an English link on a German-only route would point at a 404 on
// every render, so the switcher sends visitors to the English home page
// instead. The list is shared with pageMetadata and the sitemap — see
// GERMAN_ONLY_ROUTES in i18n/routing.ts.
//
// Plain <a> elements with hrefs from getPathname, not next-intl's <Link
// locale=…>: when a locale is passed explicitly, <Link> always writes the
// prefix, even for the unprefixed default locale. Every page therefore
// carried a link to /de/…, a redirect, and that is how Bing came to index
// /de/umzug instead of /umzug. getPathname honours localePrefix "as-needed".
// The current locale is not a link at all — it would only point at itself.

/** DE/EN toggle that preserves the current page across locales. */
export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const germanOnly = isGermanOnly(pathname);

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {routing.locales.map((targetLocale, index) => {
        const current = targetLocale === locale;
        const href = getPathname({
          locale: targetLocale,
          href: germanOnly
            ? "/"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            : ({ pathname, params } as any),
        });
        return (
          <span key={targetLocale} className="flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="mx-1 text-white/30">
                /
              </span>
            )}
            {current ? (
              <span
                aria-current="true"
                className="rounded px-1.5 py-0.5 font-semibold text-gold"
              >
                {targetLocale.toUpperCase()}
              </span>
            ) : (
              <a
                href={href}
                hrefLang={targetLocale}
                lang={targetLocale}
                className="rounded px-1.5 py-0.5 text-white/80 hover:text-gold"
              >
                {targetLocale.toUpperCase()}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
