import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import {
  isGermanOnly,
  routing,
  type AppPathname,
  type Locale,
  type StaticPathname,
} from "@/i18n/routing";
import { getBlogIndex } from "@/lib/blog";
import { getStadtteilSlugs } from "@/lib/content";
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

  // Every language version gets its own <url> entry carrying the full
  // alternate set. Listing the English pages only as alternates of the German
  // ones left them without a <loc> of their own, which is not how Google's
  // sitemap hreflang format is specified and slowed their discovery.
  // German-only pages get a single entry with no alternates — submitting an
  // hreflang alternate for those hands Google a 404 directly. Shared list,
  // see i18n/routing.ts.
  const pages: MetadataRoute.Sitemap = pathnames.flatMap((href) => {
    if (isGermanOnly(href)) return [{ url: url(routing.defaultLocale, href) }];
    const languages = {
      ...Object.fromEntries(
        routing.locales.map((locale) => [locale, url(locale, href)]),
      ),
      "x-default": url(routing.defaultLocale, href),
    };
    return routing.locales.map((locale) => ({
      url: url(locale, href),
      alternates: { languages },
    }));
  });

  const articles: MetadataRoute.Sitemap = getBlogIndex().map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.dateModified ?? article.datePublished),
  }));

  // German-only district pages.
  const stadtteile: MetadataRoute.Sitemap = getStadtteilSlugs().map((slug) => ({
    url: `${SITE_URL}/umzug/${slug}`,
  }));

  return [...pages, ...stadtteile, ...articles];
}
