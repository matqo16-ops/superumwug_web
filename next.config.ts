import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import site from "./content/site.json";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // The chat route reads the knowledge base from disk at request time,
  // so the content directory must be traced into the serverless bundle.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*"],
  },
  images: {
    // Modern formats first — Next serves AVIF/WebP to browsers that accept them.
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // /bewertung is the short address printed on invoices and QR cards. It
    // forwards to the Google "write a review" link once the owner puts that
    // link into content/site.json (googleReviewUrl). Temporary on purpose: if
    // Google ever changes the link, the printed address keeps working.
    const reviewUrl = (site as { googleReviewUrl?: string }).googleReviewUrl;
    const review = reviewUrl
      ? [{ source: "/bewertung", destination: reviewUrl, permanent: false }]
      : [];

    // Old slugs kept working after the SEO rename, so nothing 404s.
    // /bayreno is NOT here any more: it used to 301 to /renovierung, which
    // threw away the one URL that spells the brand name. It is a real page now.
    return [
      ...review,
      // German is served unprefixed, so /de/... is never a real URL. next-intl
      // strips the prefix with a 307, and a temporary redirect tells search
      // engines to keep the old URL — Bing had indexed /de/umzug instead of
      // /umzug. Declaring it permanent here runs before the middleware.
      { source: "/de", destination: "/", permanent: true },
      { source: "/de/:path*", destination: "/:path*", permanent: true },
      // Browsers and some crawlers request /favicon.ico unprompted; the icon
      // lives at /icon.png (app/icon.png).
      { source: "/favicon.ico", destination: "/icon.png", permanent: true },
      // The Haushaltsauflösung article became a service page with its own URL;
      // two URLs on one query would compete with each other.
      {
        source: "/blog/haushaltsaufloesung-ablauf",
        destination: "/haushaltsaufloesung-muenchen",
        permanent: true,
      },
      { source: "/pakete", destination: "/komplettservice", permanent: true },
      { source: "/en/packages", destination: "/en/full-service", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
