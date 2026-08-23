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
    // Some pages exist in German only — no hreflang alternates for those.
    const germanOnly =
      href === "/blog" || href === "/ratgeber/halteverbotszone-muenchen";
    return {
      url: url(routing.defaultLocale, href),
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
  }));

  return [...pages, ...articles];
}
