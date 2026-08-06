import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
    // Old slugs kept working after the SEO rename, so nothing 404s.
    return [
      { source: "/bayreno", destination: "/renovierung", permanent: true },
      { source: "/en/bayreno", destination: "/en/renovation", permanent: true },
      { source: "/pakete", destination: "/komplettservice", permanent: true },
      { source: "/en/packages", destination: "/en/full-service", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
