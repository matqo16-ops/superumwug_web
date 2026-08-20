import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getBlogArticle, getBlogIndex, getBlogSlugs } from "@/lib/blog";
import { getBlogIndexContent, getCommon } from "@/lib/content";
import { absoluteUrl, articleSchema } from "@/lib/schema";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import { btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CallbackButton } from "@/components/CallbackButton";
import { ChatCta } from "@/components/ChatCta";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export function generateStaticParams() {
  // German only — the blog is not translated.
  return getBlogSlugs().map((slug) => ({ locale: "de", slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getBlogArticle(slug);
  if (locale !== "de" || !article) return {};

  const url = `${SITE_URL}/blog/${slug}`;
  return {
    // The long, readable H1 stays; the <title> uses the shorter variant so it
    // fits inside Google's ~60-character cutoff.
    title: article.metaTitle ?? article.title,
    description: article.description,
    keywords: article.keywords,
    // The article exists in German only, so no hreflang alternates here.
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: "mmoving.de",
      type: "article",
      locale: "de_DE",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified ?? article.datePublished,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  if (locale !== "de") notFound();
  const article = getBlogArticle(slug);
  if (!article) notFound();
  setRequestLocale(locale);

  const content = getBlogIndexContent();
  const common = getCommon(locale);
  const url = `${SITE_URL}/blog/${slug}`;
  const others = getBlogIndex()
    .filter((entry) => entry.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: article.title,
          description: article.description,
          url,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          keywords: article.keywords,
        })}
      />

      <Breadcrumbs
        label={content.breadcrumbLabel}
        items={[
          { label: content.homeLabel, href: "/", url: absoluteUrl(locale, "/") },
          { label: content.blogLabel, href: "/blog", url: absoluteUrl(locale, "/blog") },
          { label: article.title, url },
        ]}
      />

      <article>
        <Section variant="cream">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-deep">
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
            <h1 className="mt-3 hyphens-auto break-words font-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">
              {article.title}
            </h1>

            {/* Rendered from trusted local markdown in content/de/blog. */}
            <div
              className="prose-mmoving mt-8"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />

            {/* Article CTA */}
            <div className="mt-12 rounded-xl border-2 border-gold bg-navy p-7 sm:p-9">
              <h2 className="font-display text-2xl font-semibold text-white">
                {article.cta.headline}
              </h2>
              <p className="mt-3 leading-relaxed text-white/75">
                {article.cta.body}
              </p>
              <CallbackButton className={`${btnPrimary} mt-6`}>
                {article.cta.button}
              </CallbackButton>
            </div>

            {/* Related service pages — the internal-link target of every article */}
            <nav aria-label={content.relatedHeadline} className="mt-10">
              <h2 className="font-display text-xl font-semibold text-navy">
                {content.relatedHeadline}
              </h2>
              <ul className="mt-4 space-y-2">
                {article.related.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-medium text-gold-deep underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
                    >
                      {item.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Section>

        <Section variant="light">
          <Faq
            headline={content.faqHeadline}
            items={article.faq}
            pageUrl={url}
          />
        </Section>
      </article>

      <ChatCta content={common.chatCta} />

      {/* Keep readers in the cluster */}
      {others.length > 0 && (
        <Section variant="cream">
          <h2 className="font-display text-2xl font-semibold text-navy">
            {content.moreArticles}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {others.map((entry) => (
              <article
                key={entry.slug}
                className="rounded-xl border border-hairline bg-white p-6 shadow-card transition-colors hover:border-gold"
              >
                <h3 className="font-display text-lg font-semibold leading-tight text-navy">
                  <Link
                    href={{ pathname: "/blog/[slug]", params: { slug: entry.slug } }}
                    className="hover:text-gold-deep"
                  >
                    {entry.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-anthracite/80">
                  {entry.excerpt}
                </p>
              </article>
            ))}
          </div>
          <Link href="/blog" className="mt-8 inline-block font-semibold text-gold-deep">
            {content.backToBlog} →
          </Link>
        </Section>
      )}
    </>
  );
}
