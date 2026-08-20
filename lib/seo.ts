import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type StaticPathname, type Locale } from "@/i18n/routing";
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
): Metadata {
  const canonical = absoluteUrl(locale, href);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = absoluteUrl(l, href);
  }
  languages["x-default"] = languages[routing.defaultLocale];

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages },
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
