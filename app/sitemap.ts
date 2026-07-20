import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

const priorities: Partial<Record<AppPathname, number>> = {
  "/": 1,
  "/umzug": 0.9,
  "/entruempelung": 0.9,
  "/pakete": 0.8,
  "/b2b": 0.7,
  "/kontakt": 0.7,
  "/impressum": 0.2,
  "/datenschutz": 0.2,
};

function url(locale: Locale, href: AppPathname): string {
  return SITE_URL + getPathname({ locale, href });
}

/** All localized public pages with hreflang alternates. /admin is deliberately absent. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pathnames = Object.keys(routing.pathnames) as AppPathname[];

  return pathnames.map((href) => ({
    url: url(routing.defaultLocale, href),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: priorities[href] ?? 0.5,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, url(locale, href)]),
      ),
    },
  }));
}
