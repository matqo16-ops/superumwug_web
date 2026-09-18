import "server-only";
import fs from "fs";
import path from "path";
import type { StaticPathname } from "@/i18n/routing";
import { parseMarkdownDoc } from "./blog";
import type { FaqItem, Hero } from "./content-types";

/**
 * Service guide pages: one sub-service each (Haushaltsauflösung first), at a
 * flat German URL like /haushaltsaufloesung-muenchen. Same file format as the
 * blog — markdown with JSON front matter in content/de/leistungen — because
 * the substance is a guide, but rendered as a service page: price table from
 * the parent service, tap-to-call, Service and HowTo schema.
 *
 * German only. Every page must carry its own process, its own FAQ and a slice
 * of a published price table — one that would only reword the parent page
 * should not exist (Google's scaled-content policy).
 */
export interface LeistungFrontMatter {
  /** <title>, <= 60 characters. */
  metaTitle: string;
  description: string;
  hero: Hero;
  datePublished: string;
  dateModified?: string;
  /** Which service table the price section comes from. */
  pricing: "umzug" | "entruempelung" | "renovierung";
  /** First cells of the table rows to show; all rows if omitted. */
  rows?: string[];
  /** The hub this page belongs under, for breadcrumbs and schema. */
  parent: { label: string; href: StaticPathname };
  serviceType: string;
  brand: string;
  /** Headings that open with this prefix become HowTo steps ("Schritt"). */
  stepPrefix?: string;
  howToName?: string;
  faq: FaqItem[];
  cta: { headline: string; body: string };
  /** Final German paths, rendered as plain links. */
  related: { label: string; href: string }[];
}

export type Leistung = LeistungFrontMatter & {
  slug: string;
  html: string;
  readingMinutes: number;
  /** Steps parsed from the markdown, for HowTo schema. */
  steps: { name: string; text: string }[];
};

const dir = path.join(process.cwd(), "content", "de", "leistungen");

/** "## Schritt 3: Bestandsaufnahme" + its first paragraph → a HowTo step. */
function extractSteps(markdown: string, prefix: string) {
  const steps: { name: string; text: string }[] = [];
  const sections = markdown.split(/^## /m).slice(1);
  for (const section of sections) {
    const [heading, ...rest] = section.split("\n");
    if (!heading.startsWith(prefix)) continue;
    const firstParagraph = rest
      .join("\n")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !p.startsWith("|") && !p.startsWith("#"));
    steps.push({
      name: heading.replace(/^[^:]*:\s*/, "").trim(),
      text: (firstParagraph ?? "")
        .replace(/\*\*|__/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim(),
    });
  }
  return steps;
}

export function getLeistung(slug: string): Leistung {
  const file = path.join(dir, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const doc = parseMarkdownDoc<LeistungFrontMatter>(slug, raw);
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").replace(/\r\n/g, "\n");
  return {
    ...doc,
    steps: doc.stepPrefix ? extractSteps(body, doc.stepPrefix) : [],
  };
}
