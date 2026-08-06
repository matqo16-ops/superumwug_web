import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getBlogIndex } from "@/lib/blog";
import { getBlogIndexContent } from "@/lib/content";
import { absoluteUrl } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de") return {};
  return pageMetadata(locale, "/blog", getBlogIndexContent().meta);
}

/** The blog targets German local search only — /en/blog intentionally 404s. */
export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "de") notFound();
  setRequestLocale(locale);

  const content = getBlogIndexContent();
  const articles = getBlogIndex();

  return (
    <>
      <Breadcrumbs
        label={content.breadcrumbLabel}
        items={[
          { label: content.homeLabel, href: "/", url: absoluteUrl(locale, "/") },
          { label: content.blogLabel, url: absoluteUrl(locale, "/blog") },
        ]}
      />

      <Section variant="cream">
        <SectionHeading intro={content.intro}>{content.headline}</SectionHeading>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col rounded-xl border border-hairline bg-white p-6 shadow-card transition-colors hover:border-gold"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep">
                <time dateTime={article.datePublished}>
                  {new Date(article.datePublished).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                {" · "}
                {article.readingMinutes} {content.readingTimeSuffix}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold leading-tight text-navy">
                <Link
                  href={{ pathname: "/blog/[slug]", params: { slug: article.slug } }}
                  className="hover:text-gold-deep"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="mt-3 flex-1 leading-relaxed text-anthracite/85">
                {article.excerpt}
              </p>
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: article.slug } }}
                className="mt-4 font-semibold text-gold-deep"
                aria-label={`${content.readMore}: ${article.title}`}
              >
                {content.readMore} →
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
