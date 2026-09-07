import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import {
  isGermanOnly,
  routing,
  type StaticPathname,
  type Locale,
} from "@/i18n/routing";
import type { PageMeta } from "./content-types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mmoving.de";

function absoluteUrl(locale: Locale, href: StaticPathname): string {
  return SITE_URL + getPathname({ locale, href });
}

/** Shared social-sharing card (1200×630) used when a page has no own image. */
export const OG_IMAGE = {
  url: `${SITE_URL}/images/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: "mmoving.de — Umzug, Entrümpelung und Renovierung in München und Umgebung",
};

/**
 * Per-page metadata with canonical URL and hreflang alternates for both
 * locales (plus x-default pointing at the German version).
 */
export function pageMetadata(
  locale: Locale,
  href: StaticPathname,
  meta: PageMeta,
  options: {
    /**
     * Escape hatch only. German-only routes are detected automatically from
     * GERMAN_ONLY_ROUTES, so callers should not normally pass this.
     */
    germanOnly?: boolean;
  } = {},
): Metadata {
  const canonical = absoluteUrl(locale, href);
  // Derived, not asked for: emitting hreflang="en" at a route that has no
  // English version points Google at a 404, and one dead alternate can
  // invalidate the hreflang set for the whole page. That is what put a
  // "Not found (404)" in Search Console for /en/ratgeber/... — so the check
  // reads the shared list rather than trusting every caller to remember.
  const germanOnly = options.germanOnly ?? isGermanOnly(href);
  const languages: Record<string, string> | undefined = germanOnly
    ? undefined
    : {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, absoluteUrl(l, href)]),
        ),
        "x-default": absoluteUrl(routing.defaultLocale, href),
      };

  return {
    title: meta.title,
    description: meta.description,
    alternates: languages ? { canonical, languages } : { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: "mmoving.de",
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE.url],
    },
  };
}
