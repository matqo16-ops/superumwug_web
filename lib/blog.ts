import "server-only";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import type { StaticPathname } from "@/i18n/routing";
import type { FaqItem } from "./content-types";

/**
 * Blog articles live at content/de/blog/<slug>.md as markdown with a JSON
 * front-matter block, so nested data (FAQ entries, related links) round-trips
 * without needing a YAML parser.
 *
 * The blog is German-only: it targets local Munich search intent, and the
 * article bodies are not translated. `/en/blog` therefore 404s by design.
 */
export interface BlogFrontMatter {
  title: string;
  /** Shorter <title> when the H1 headline exceeds 60 characters. */
  metaTitle?: string;
  /** Meta description, max 155 chars. */
  description: string;
  /** Short summary shown on the index card. */
  excerpt: string;
  datePublished: string;
  dateModified?: string;
  keywords: string[];
  /** Service pages this article should funnel readers to. */
  related: { label: string; href: StaticPathname }[];
  faq: FaqItem[];
  /** Call to action rendered at the end of the article. */
  cta: { headline: string; body: string; button: string };
}

export interface BlogArticle extends BlogFrontMatter {
  slug: string;
  /** Rendered HTML body. */
  html: string;
  readingMinutes: number;
}

export interface BlogSummary
  extends Pick<
    BlogFrontMatter,
    "title" | "metaTitle" | "description" | "excerpt" | "datePublished" | "keywords"
  > {
  slug: string;
  readingMinutes: number;
}

const blogDir = path.join(process.cwd(), "content", "de", "blog");
const cache = new Map<string, BlogArticle>();

function parse(slug: string, raw: string): BlogArticle {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Blog article ${slug} is missing its JSON front matter.`);
  }
  const front = JSON.parse(match[1]) as BlogFrontMatter;
  const body = match[2];

  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    ...front,
    slug,
    html: marked.parse(body, { async: false }) as string,
    // ~200 wpm is the usual German reading estimate; never show "0 min".
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getBlogArticle(slug: string): BlogArticle | null {
  const cached = cache.get(slug);
  if (cached) return cached;

  const file = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const article = parse(slug, fs.readFileSync(file, "utf8"));
  cache.set(slug, article);
  return article;
}

/** All articles, newest first. */
export function getBlogIndex(): BlogSummary[] {
  return getBlogSlugs()
    .map((slug) => getBlogArticle(slug))
    .filter((article): article is BlogArticle => article !== null)
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    .map(({ slug, title, metaTitle, description, excerpt, datePublished, keywords, readingMinutes }) => ({
      slug,
      title,
      metaTitle,
      description,
      excerpt,
      datePublished,
      keywords,
      readingMinutes,
    }));
}
