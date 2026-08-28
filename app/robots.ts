import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * AI crawlers, named explicitly rather than left to the wildcard rule.
 *
 * The wildcard `allow: "/"` below already permits every one of these — this
 * list changes nothing about what is technically allowed. It exists because
 * the whole SEO/GEO strategy here is to be citable: llms.txt invites
 * attribution, IndexNow pushes new pages to Bing within minutes. A business
 * playing that game wants training crawlers as much as answer-engine
 * crawlers — being IN a model's training data is part of getting
 * recommended by it, not a risk to opt out of. Named allow-rules also survive
 * a later "disallow: '*' for some other reason" that forgets these need a
 * carve-out, which a bare wildcard allow does not protect against.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // ChatGPT Search
  "ChatGPT-User", // ChatGPT "visit this page" / plugins
  "ClaudeBot", // Anthropic training
  "Claude-SearchBot", // Claude web search
  "Claude-User", // Claude "visit this page"
  "PerplexityBot", // Perplexity indexing
  "Perplexity-User", // Perplexity "visit this page"
  "Google-Extended", // Gemini / AI Overviews training
  "Applebot-Extended", // Apple Intelligence training
  "Meta-ExternalAgent", // Meta AI training
  "Amazonbot", // Alexa / Amazon AI
  "CCBot", // Common Crawl — feeds many open models
  "Bytespider", // ByteDance training
  "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/admin", "/api"],
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
