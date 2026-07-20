import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // The chat route reads the knowledge base from disk at request time,
  // so the content directory must be traced into the serverless bundle.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*"],
  },
};

export default withNextIntl(nextConfig);
