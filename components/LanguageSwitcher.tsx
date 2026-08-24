"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Routes that exist in German only. Offering an English link on these would
 * point at a 404 on every render, so the switcher sends visitors to the
 * English home page instead of a dead URL.
 */
const GERMAN_ONLY: string[] = [
  "/blog",
  "/blog/[slug]",
  "/umzug/[stadtteil]",
  "/ratgeber/halteverbotszone-muenchen",
];

/** DE/EN toggle that preserves the current page across locales. */
export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const germanOnly = GERMAN_ONLY.includes(pathname);

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {routing.locales.map((targetLocale, index) => (
        <span key={targetLocale} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="mx-1 text-white/30">
              /
            </span>
          )}
          <Link
            // Pathname comes from the current route, params keep dynamic
            // segments. On German-only routes the other locale falls back to
            // the home page rather than linking to a URL that does not exist.
            href={
              germanOnly && targetLocale !== locale
                ? "/"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                : ({ pathname, params } as any)
            }
            locale={targetLocale}
            aria-current={targetLocale === locale ? "true" : undefined}
            className={
              targetLocale === locale
                ? "rounded px-1.5 py-0.5 font-semibold text-gold"
                : "rounded px-1.5 py-0.5 text-white/80 hover:text-gold"
            }
          >
            {targetLocale.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );
}
