import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import {
  routing,
  type AppPathname,
  type Locale,
  type StaticPathname,
} from "@/i18n/routing";
import { getBlogIndex } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

const priorities: Partial<Record<StaticPathname, number>> = {
  "/": 1,
  "/umzug": 0.9,
  "/entruempelung": 0.9,
  "/renovierung": 0.9,
  "/komplettservice": 0.9,
  "/blog": 0.6,
  "/b2b": 0.7,
  "/kontakt": 0.7,
  "/impressum": 0.2,
  "/datenschutz": 0.2,
};

function url(locale: Locale, href: StaticPathname): string {
  return SITE_URL + getPathname({ locale, href });
}

/**
 * All localized public pages with hreflang alternates, plus the German-only
 * blog. /admin is deliberately absent, and the dynamic [slug] template is
 * replaced by the concrete article URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pathnames = (Object.keys(routing.pathnames) as AppPathname[]).filter(
    (href): href is StaticPathname => !href.includes("["),
  );

  const pages: MetadataRoute.Sitemap = pathnames.map((href) => {
    // The blog exists in German only — no hreflang alternates for it.
    const germanOnly = href === "/blog";
    return {
      url: url(routing.defaultLocale, href),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: priorities[href] ?? 0.5,
      ...(germanOnly
        ? {}
        : {
            alternates: {
              languages: Object.fromEntries(
                routing.locales.map((locale) => [locale, url(locale, href)]),
              ),
            },
          }),
    };
  });

  const articles: MetadataRoute.Sitemap = getBlogIndex().map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.datePublished),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
