import "server-only";
import { getPathname } from "@/i18n/navigation";
import type { Locale, StaticPathname } from "@/i18n/routing";
import { getSiteData } from "./content";
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

/** LocalBusiness / MovingCompany — the root entity for the whole site. */
export function localBusinessSchema(locale: Locale) {
  const site = getSiteData();
  const org = site.organization;

  return {
    "@context": "https://schema.org",
    "@type": ["MovingCompany", "HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": BUSINESS_ID,
    name: "mmoving.de",
    legalName: org.legalName,
    alternateName: ["SuperUmzug", "Entrümpelung München", "BayReno"],
    url: `${SITE_URL}/`,
    telephone: org.phone,
    email: org.email,
    description:
      locale === "de"
        ? "mmoving.de bündelt Umzug, Entrümpelung und Renovierung für München und Umgebung — drei Gewerke, ein Ansprechpartner."
        : "mmoving.de combines moving, clearance and renovation for Munich and the surrounding area — three trades, one point of contact.",
    address: {
      "@type": "PostalAddress",
      streetAddress: org.streetAddress,
      addressLocality: org.addressLocality,
      postalCode: org.postalCode,
      addressRegion: "Bayern",
      addressCountry: org.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.1351,
      longitude: 11.582,
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
    knowsLanguage: ["de", "en"],
    logo: `${SITE_URL}/logos/mmoving-hexagon.png`,
    image: `${SITE_URL}/icon.png`,
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Umzug München" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entrümpelung München" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Haushaltsauflösung München" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Renovierung München" } },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Komplettservice Umzug, Entrümpelung und Renovierung München" },
      },
    ],
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
      servicePhone: site.organization.phone,
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
    author: { "@id": BUSINESS_ID },
    publisher: { "@id": BUSINESS_ID },
    image: `${SITE_URL}/icon.png`,
  };
}
