import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  // German is served at the root without a prefix; English lives under /en.
  localePrefix: "as-needed",
  // German is the canonical default: never auto-redirect `/` to `/en` based on
  // the browser's Accept-Language. Visitors switch language via the header.
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/umzug": { de: "/umzug", en: "/moving" },
    "/umzug/[stadtteil]": "/umzug/[stadtteil]",
    "/renovierung": { de: "/renovierung", en: "/renovation" },
    // Brand pages. Deliberately the same slug in both locales: these are
    // names, and a search for one must land on a URL that spells it exactly.
    // Entrümpelung München has none on purpose — see lib/content.ts.
    "/bayreno": "/bayreno",
    "/superumzug": "/superumzug",
    "/entruempelung": { de: "/entruempelung", en: "/clearance" },
    "/komplettservice": { de: "/komplettservice", en: "/full-service" },
    "/ueber-uns": { de: "/ueber-uns", en: "/about" },
    "/ratgeber/halteverbotszone-muenchen": "/ratgeber/halteverbotszone-muenchen",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/b2b": "/b2b",
    "/kontakt": { de: "/kontakt", en: "/contact" },
    "/impressum": { de: "/impressum", en: "/imprint" },
    "/datenschutz": { de: "/datenschutz", en: "/privacy" },
    "/agb": { de: "/agb", en: "/terms" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

/**
 * Routes that exist in German only. The single source of truth — three
 * separate places need to agree about this, and they have drifted twice.
 *
 * Each consumer breaks differently when it is missed, which is why the list
 * lives here rather than being repeated:
 *   - `pageMetadata` would emit hreflang="en" at a URL that 404s, and one
 *     dead alternate can invalidate the hreflang set for the whole page.
 *   - `LanguageSwitcher` would offer visitors a link to that same 404.
 *   - `sitemap.ts` would submit the dead alternate to Google directly.
 *
 * Adding a German-only route means adding it here and nowhere else.
 */
export const GERMAN_ONLY_ROUTES = [
  "/blog",
  "/blog/[slug]",
  "/umzug/[stadtteil]",
  "/ratgeber/halteverbotszone-muenchen",
] as const satisfies readonly AppPathname[];

export function isGermanOnly(href: string): boolean {
  return (GERMAN_ONLY_ROUTES as readonly string[]).includes(href);
}

/**
 * Pathnames without dynamic segments. `/blog/[slug]` needs a `params` object,
 * so anywhere we accept a bare href string (nav items, breadcrumbs, footer
 * links) must exclude it.
 */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}]${string}`>;
