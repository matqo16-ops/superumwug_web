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
    "/entruempelung": { de: "/entruempelung", en: "/clearance" },
    "/pakete": { de: "/pakete", en: "/packages" },
    "/b2b": "/b2b",
    "/kontakt": { de: "/kontakt", en: "/contact" },
    "/impressum": { de: "/impressum", en: "/imprint" },
    "/datenschutz": { de: "/datenschutz", en: "/privacy" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
