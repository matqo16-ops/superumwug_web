import { Link } from "@/i18n/navigation";
import type { Locale, StaticPathname } from "@/i18n/routing";
import { getCommon } from "@/lib/content";
import type { Brand, BrandPageContent } from "@/lib/content-types";
import { absoluteUrl, brandNodes, BUSINESS_ID } from "@/lib/schema";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "./Breadcrumbs";
import { CallbackButton } from "./CallbackButton";
import { ChatCta } from "./ChatCta";
import { Faq } from "./Faq";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { Section, SectionHeading } from "./Section";

/**
 * A page about one brand, at the brand's own URL.
 *
 * It exists for entity resolution, not for sales. A coined trading name with
 * little search volume has nothing behind it unless some page uses that name
 * as its URL, its title and its H1 at once and says what the name means — so
 * a search engine falls back to the commonest word spelled almost the same.
 * The service page stays where it is and keeps targeting the generic keyword;
 * this one only has to answer "what is <name>".
 *
 * Deliberately NOT used for Entrümpelung München: that name is also the head
 * commercial keyword, so a second page carrying it would compete with
 * /entruempelung instead of supporting it.
 */
export function BrandPage({
  content,
  locale,
  brandId,
  brandName,
  href,
  serviceHref,
  callbackTopic,
}: {
  content: BrandPageContent;
  locale: Locale;
  brandId: Brand["id"];
  /** Must match the `name` of the node in brandNodes(). */
  brandName: string;
  /** This page's own pathname, for canonical URLs and breadcrumbs. */
  href: StaticPathname;
  /** The brand's service page — where the CTAs send people. */
  serviceHref: StaticPathname;
  callbackTopic?: string;
}) {
  const common = getCommon(locale);
  const url = absoluteUrl(locale, href);
  const brand = brandNodes().find((node) => node.name === brandName);
  const externalSite = brand?.sameAs?.[0];

  return (
    <>
      {/* The page is *about* the brand — mainEntity, not a passing mention. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            brand,
            {
              "@type": "AboutPage",
              "@id": `${url}#aboutpage`,
              url,
              name: content.meta.title,
              description: content.meta.description,
              inLanguage: locale === "de" ? "de-DE" : "en",
              mainEntity: { "@id": brand?.["@id"] },
              about: { "@id": brand?.["@id"] },
              publisher: { "@id": BUSINESS_ID },
            },
          ],
        }}
      />

      <Hero
        content={content.hero}
        character={common.characters[brandId]}
        actions={
          <>
            <CallbackButton topic={callbackTopic} className={btnPrimary}>
              {content.hero.primaryCta}
            </CallbackButton>
            <Link href={serviceHref} className={btnOutlineOnDark}>
              {content.hero.secondaryCta}
            </Link>
          </>
        }
      />

      <Breadcrumbs
        label="Breadcrumb"
        items={[
          {
            label: locale === "de" ? "Startseite" : "Home",
            href: "/",
            url: absoluteUrl(locale, "/"),
          },
          { label: brandName, url },
        ]}
      />

      {/* The definition, first thing on the page, in one liftable sentence. */}
      <Section variant="light">
        <p className="max-w-3xl text-lg leading-relaxed text-anthracite/90">
          {content.lead}
        </p>
      </Section>

      {/* Spelling the name out is the whole reason this page exists. */}
      <Section variant="navy">
        <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
          {content.nameExplainer.heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/80">
          {content.nameExplainer.body}
        </p>
      </Section>

      <Section variant="cream">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-navy">
                {section.heading}
              </h2>
              <p className="mt-2 leading-relaxed text-anthracite/85">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="light">
        <SectionHeading intro={content.services.intro}>
          {content.services.headline}
        </SectionHeading>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.services.items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-hairline bg-white p-6 shadow-card"
            >
              <h3 className="font-display text-lg font-semibold text-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-anthracite/85">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <Link
          href={serviceHref}
          className="mt-8 inline-block font-semibold text-gold-deep hover:underline"
        >
          {content.services.cta} →
        </Link>
      </Section>

      <Section variant="cream">
        <SectionHeading>{content.facts.headline}</SectionHeading>
        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          {content.facts.items.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-0.5 rounded-xl border border-hairline bg-white p-5 shadow-card sm:flex-row sm:gap-4"
            >
              <dt className="w-36 shrink-0 text-sm font-semibold uppercase tracking-wide text-anthracite/60">
                {fact.label}
              </dt>
              <dd className="text-anthracite/90">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Declared, not hidden: the brand's own site belongs to this business. */}
      {externalSite && (
        <Section variant="light">
          <div className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-8">
            <h2 className="font-display text-xl font-semibold text-navy">
              {content.externalSite.headline}
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-anthracite/85">
              {content.externalSite.body}
            </p>
            <a
              href={externalSite}
              className="mt-4 inline-block font-semibold text-gold-deep hover:underline"
              rel="me"
            >
              {content.externalSite.linkLabel} →
            </a>
          </div>
        </Section>
      )}

      <Section variant="cream">
        <SectionHeading intro={content.siblings.body}>
          {content.siblings.headline}
        </SectionHeading>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {content.siblings.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-hairline bg-white p-6 shadow-card transition-colors hover:border-gold"
            >
              <h3 className="font-display text-lg font-semibold text-navy group-hover:text-gold-deep">
                {item.label}
              </h3>
              <p className="mt-2 leading-relaxed text-anthracite/85">
                {item.body}
              </p>
              <span
                aria-hidden="true"
                className="mt-3 inline-block font-semibold text-gold-deep"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <ChatCta content={common.chatCta} />

      <Section variant="light">
        <Faq
          headline={content.faq.headline}
          items={content.faq.items}
          pageUrl={url}
        />
      </Section>
    </>
  );
}
