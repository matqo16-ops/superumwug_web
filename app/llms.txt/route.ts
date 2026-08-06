import fs from "fs";
import path from "path";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Serves /llms.txt — the plain-markdown summary LLM crawlers read to understand
 * the business. Source of truth is content/llms.txt so it stays editable
 * alongside the rest of the copy.
 */
export function GET(): Response {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "content", "llms.txt"),
    "utf8",
  );
  // Keep the file authored against the canonical domain even if the deployment
  // is previewed elsewhere.
  const body = raw.replaceAll("https://mmoving.de", SITE_URL);

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
