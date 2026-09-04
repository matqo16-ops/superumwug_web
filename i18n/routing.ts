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
 * Pathnames without dynamic segments. `/blog/[slug]` needs a `params` object,
 * so anywhere we accept a bare href string (nav items, breadcrumbs, footer
 * links) must exclude it.
 */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}]${string}`>;
