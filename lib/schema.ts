import "server-only";
import { getPathname } from "@/i18n/navigation";
import type { Locale, StaticPathname } from "@/i18n/routing";
import {
  getSiteData,
  getUmzug,
  getEntruempelung,
  getRenovierung,
} from "./content";
import type { FaqItem } from "./content-types";
import { SITE_URL } from "./seo";

/** Stable @id for the one business entity every other node points back to. */
export const BUSINESS_ID = `${SITE_URL}/#business`;

export function absoluteUrl(locale: Locale, href: StaticPathname): string {
  return SITE_URL + getPathname({ locale, href });
}

/**
 * Munich plus the surrounding towns we actually serve. Listing them explicitly
 * gives search engines and LLMs a concrete service radius to quote.
 */
export const AREAS_SERVED = [
  "München",
  "Dachau",
  "Freising",
  "Erding",
  "Ebersberg",
  "Starnberg",
  "Fürstenfeldbruck",
  "Germering",
  "Unterschleißheim",
  "Garching bei München",
  "Holzkirchen",
  "Landkreis München",
];

/**
 * Absolute euro figures in one pricing-table cell, e.g. "450 – 850 €".
 *
 * Per-unit rates ("12 – 25 € / m²") are deliberately rejected: mixing a rate
 * into a total-price band produces a meaningless range, and an AggregateOffer
 * spanning "12" to "22000" would misrepresent what the work costs.
 */
function parseBand(cell: string): { low: number; high: number } | null {
  if (/\/\s*m²|pro\s+m²|per\s+m²|\/\s*km|pro\s+Stunde|per hour/i.test(cell)) {
    return null;
  }
  const nums = (cell.match(/\d[\d.,]*/g) ?? [])
    .map((n) => Number(n.replace(/\./g, "").replace(",", ".")))
    .filter((n) => Number.isFinite(n));
  if (!nums.length) return null;
  return { low: Math.min(...nums), high: Math.max(...nums) };
}

/**
 * Lowest and highest euro figure across a published price table. The price
 * column is located by its heading rather than by position — the Entrümpelung
 * table ends with "Dauer", not with a price.
 */
function tableBand(
  columns: string[],
  rows: string[][],
): { low: number; high: number } | null {
  let index = columns.findIndex((c) =>
    /marktüblich|market rate|preis|price|brutto|gross/i.test(c),
  );
  if (index < 0) index = columns.length - 1;

  const bands = rows
    .map((r) => parseBand(r[index] ?? ""))
    .filter((b): b is { low: number; high: number } => b !== null);
  if (!bands.length) return null;
  return {
    low: Math.min(...bands.map((b) => b.low)),
    high: Math.max(...bands.map((b) => b.high)),
  };
}

/**
 * Services we publish a price for, with the band read straight from the
 * rendered tables — so structured data and the visible page cannot disagree.
 */
function publishedOffers() {
  const u = getUmzug("de").pricing;
  const e = getEntruempelung("de").pricing;
  const r = getRenovierung("de").pricing;
  const umzug = tableBand(u.columns, u.rows);
  const entruempelung = tableBand(e.columns, e.rows);
  const renovierung = tableBand(r.columns, r.rows);
  return [
    { name: "Umzug München", band: umzug },
    { name: "Entrümpelung München", band: entruempelung },
    { name: "Haushaltsauflösung München", band: entruempelung },
    { name: "Renovierung München", band: renovierung },
    { name: "Besichtigungsservice", band: { low: 290, high: 290 } },
    {
      name: "Komplettservice Umzug, Entrümpelung und Renovierung München",
      band: null,
    },
  ];
}

/**
 * The three trading names as first-class Brand nodes.
 *
 * `brand: [{ "@type": "Brand", name: "BayReno" }]` asserts nothing resolvable:
 * no @id, no url, no sameAs. An invented compound with almost no query volume
 * then has nothing behind it, and a search engine reasonably concludes the
 * user meant a far more common word spelled almost the same way. Each brand
 * here gets an identity, a page that is about it, the expansion of the name,
 * and the brand's own external site.
 */
export function brandNodes() {
  const site = getSiteData();
  return [
    {
      "@type": "Brand",
      "@id": `${SITE_URL}/#brand-bayreno`,
      name: "BayReno",
      // The written-out form is what makes the coined word legible as a name
      // rather than a typo: Bay(ern) + Reno(vierung).
      alternateName: ["Bayerische Renovierung", "Bay Reno", "BayReno München"],
      url: `${SITE_URL}/bayreno`,
      sameAs: [site.brandSites.bayreno],
      logo: `${SITE_URL}/logos/bayreno.png`,
      description:
        "BayReno — Bayerische Renovierung. Renovierungsmarke des Einzelunternehmens Martin Marcinko in Germering bei München: Malerarbeiten, Böden, Bad und Komplettsanierung seit 2004.",
    },
    {
      "@type": "Brand",
      "@id": `${SITE_URL}/#brand-superumzug`,
      name: "SuperUmzug",
      alternateName: ["Super Umzug", "SuperUmzug München"],
      url: absoluteUrl("de", "/superumzug"),
      sameAs: [site.brandSites.superumzug],
      logo: `${SITE_URL}/logos/super-umzug.png`,
      description:
        "SuperUmzug — Umzugsmarke des Einzelunternehmens Martin Marcinko: Privat- und Firmenumzüge in München und Umgebung seit 2004.",
    },
    {
      "@type": "Brand",
      "@id": `${SITE_URL}/#brand-entruempelung-muenchen`,
      name: "Entrümpelung München",
      alternateName: ["EntrümpelungMünchen", "Entrümpelung München by mmoving.de"],
      // Points at the service page, and there is deliberately no separate
      // brand page: unlike the other two, this name is also the head
      // commercial keyword, so a second page carrying it would split the
      // signal against /entruempelung rather than reinforce it.
      url: absoluteUrl("de", "/entruempelung"),
      logo: `${SITE_URL}/logos/super-entruempelung.png`,
      description:
        "Entrümpelung München — Entrümpelungsmarke des Einzelunternehmens Martin Marcinko: Entrümpelung und Haushaltsauflösung in München und Umgebung.",
    },
  ];
}

/**
 * Martin Marcinko as a first-class entity. Blog articles are authored by a
 * person, not by a company — which is what E-E-A-T and LLM attribution read.
 */
export function personSchema() {
  const site = getSiteData();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#martin-marcinko`,
    name: site.organization.legalName,
    jobTitle: "Inhaber",
    worksFor: { "@id": BUSINESS_ID },
    knowsLanguage: ["de", "en", "sk", "cs", "pl", "uk", "hr"],
  };
}

/**
 * The site itself as a WebSite node, distinct from the business it publishes.
 * No SearchAction: the site has no internal search endpoint, and declaring
 * one that doesn't exist would be structured data that doesn't match the
 * page — worse than not having the node at all.
 */
export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "mmoving.de",
    inLanguage: locale === "de" ? "de-DE" : "en",
    publisher: { "@id": BUSINESS_ID },
  };
}

/**
 * The four services as an ItemList, referencing each Service node by @id
 * rather than restating it. Placed on the homepage so the root of the site
 * hands both crawlers and LLMs one clean enumeration of what the business
 * does, instead of leaving them to reconstruct it from four separate pages.
 */
export function servicesItemListSchema(locale: Locale) {
  const services: { href: StaticPathname; name: string }[] = [
    {
      href: "/umzug",
      name: locale === "de" ? "Umzug München" : "Moving in Munich",
    },
    {
      href: "/entruempelung",
      name:
        locale === "de"
          ? "Entrümpelung München"
          : "Clearance in Munich",
    },
    {
      href: "/renovierung",
      name: locale === "de" ? "Renovierung München" : "Renovation in Munich",
    },
    {
      href: "/komplettservice",
      name:
        locale === "de"
          ? "Komplettservice: Umzug, Entrümpelung und Renovierung"
          : "Full service: moving, clearance and renovation",
    },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#services`,
    name: locale === "de" ? "Leistungen von mmoving.de" : "Services offered by mmoving.de",
    itemListElement: services.map((s, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(locale, s.href),
      item: { "@id": `${absoluteUrl(locale, s.href)}#service` },
      name: s.name,
    })),
  };
}

/** LocalBusiness / MovingCompany — the root entity for the whole site. */
export function localBusinessSchema(locale: Locale) {
  const site = getSiteData();
  const org = site.organization;
  const loc = site.businessLocation;
  const owner = `${SITE_URL}/#martin-marcinko`;

  return {
    "@context": "https://schema.org",
    "@type": ["MovingCompany", "HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": BUSINESS_ID,
    // Must match the Google Business Profile name verbatim — that string is
    // what lets Google resolve the profile and this site to one entity.
    name: org.businessName,
    legalName: org.legalName,
    alternateName: org.brands,
    brand: brandNodes(),
    url: `${SITE_URL}/`,
    // Ties this site to the Google Business Profile and to each brand's own
    // site as one and the same entity. The brand sites rank for their own
    // names; without this they look like competitors rather than us.
    sameAs: [
      site.googleBusinessProfile,
      site.brandSites.bayreno,
      site.brandSites.superumzug,
    ],
    founder: { "@id": owner },
    employee: { "@id": owner },
    hasMap: site.googleBusinessProfile,
    // The line for this page's language is the primary one; both are declared
    // as contactPoints with the language each is actually staffed in, which is
    // how schema.org expresses "call this one and someone answers in English".
    telephone: org.phone[locale],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: org.phone.de,
        contactType: "customer service",
        availableLanguage: ["de"],
        areaServed: "DE",
      },
      {
        "@type": "ContactPoint",
        telephone: org.phone.en,
        contactType: "customer service",
        availableLanguage: ["en"],
        areaServed: "DE",
      },
    ],
    email: org.email,
    description:
      locale === "de"
        ? "mmoving.de bündelt Umzug, Entrümpelung und Renovierung für München und Umgebung — drei Gewerke, ein Ansprechpartner."
        : "mmoving.de combines moving, clearance and renovation for Munich and the surrounding area — three trades, one point of contact.",
    // The visitable location, matching the Google Business Profile — not the
    // legal Impressum address, which differs (see SiteData.businessLocation).
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.streetAddress,
      addressLocality: loc.addressLocality,
      postalCode: loc.postalCode,
      addressRegion: "Bayern",
      addressCountry: loc.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: loc.latitude,
      longitude: loc.longitude,
    },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "City", name })),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 48.1351,
        longitude: 11.582,
      },
      geoRadius: 50000,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Bank transfer, Invoice",
    foundingDate: "2004",
    knowsLanguage: ["de", "en", "sk", "cs", "pl", "uk", "hr"],
    logo: `${SITE_URL}/logos/mmoving-hexagon.png`,
    image: `${SITE_URL}/images/og-image.jpg`,
    makesOffer: publishedOffers().map((o) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: o.name },
      ...(o.band
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "EUR",
              minPrice: o.band.low,
              maxPrice: o.band.high,
              valueAddedTaxIncluded: true,
            },
          }
        : {}),
    })),
  };
}

/** Service node for one of the four service pages. */
export function serviceSchema(options: {
  locale: Locale;
  href: StaticPathname;
  serviceType: string;
  name: string;
  description: string;
  offers?: { name: string; description: string }[];
}) {
  const site = getSiteData();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(options.locale, options.href)}#service`,
    serviceType: options.serviceType,
    name: options.name,
    description: options.description,
    url: absoluteUrl(options.locale, options.href),
    provider: { "@id": BUSINESS_ID },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "City", name })),
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(options.locale, "/kontakt"),
      servicePhone: site.organization.phone[options.locale],
    },
    ...(options.offers?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: options.name,
            itemListElement: options.offers.map((offer) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: offer.name,
                description: offer.description,
              },
            })),
          },
        }
      : {}),
  };
}

/** FAQPage built from the same items the visible accordion renders. */
export function faqSchema(items: FaqItem[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function articleSchema(options: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.headline,
    description: options.description,
    url: options.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": options.url },
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    inLanguage: "de",
    ...(options.keywords?.length ? { keywords: options.keywords.join(", ") } : {}),
    author: { "@id": `${SITE_URL}/#martin-marcinko` },
    publisher: { "@id": BUSINESS_ID },
    image: `${SITE_URL}/icon.png`,
  };
}
