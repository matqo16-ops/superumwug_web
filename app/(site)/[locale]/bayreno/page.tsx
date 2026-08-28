import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getBayreno, getCommon, getSiteData } from "@/lib/content";
import { absoluteUrl, brandNodes, BUSINESS_ID } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CallbackButton } from "@/components/CallbackButton";
import { ChatCta } from "@/components/ChatCta";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/bayreno", getBayreno(locale).meta);
}

/**
 * The BayReno brand page.
 *
 * This page exists for one reason: a search for the bare name returned a
 * spelling correction to a much larger unrelated brand, because nothing on the
 * web used "BayReno" as a name in a position that carries weight. The brand
 * name is therefore the URL, the <title> and the H1 here, and the page states
 * outright what the word means and who trades under it.
 *
 * /bayreno used to 301 to /renovierung. That redirect is gone. The two pages
 * do not compete: this one answers "what is BayReno", /renovierung answers
 * "what does renovation in Munich cost".
 */
export default async function BayrenoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getBayreno(locale);
  const common = getCommon(locale);
  const site = getSiteData();
  const url = absoluteUrl(locale, "/bayreno");
  const brand = brandNodes().find((b) => b.name === "BayReno");
  const [bayrenoSite] = site.brandSites;

  return (
    <>
      {/* The page is *about* the brand — mainEntity, not just a mention. */}
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
        character={common.characters.bayreno}
        actions={
          <>
            <CallbackButton topic="renovierung" className={btnPrimary}>
              {content.hero.primaryCta}
            </CallbackButton>
            <Link href="/renovierung" className={btnOutlineOnDark}>
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
          { label: "BayReno", url },
        ]}
      />

      {/* The definition, first thing on the page, in one liftable sentence. */}
      <Section variant="light">
        <p className="max-w-3xl text-lg leading-relaxed text-anthracite/90">
          {content.lead}
        </p>
      </Section>

      {/* Spelling the coined name out is the whole point of the page. */}
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
          href="/renovierung"
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
      <Section variant="light">
        <div className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-8">
          <h2 className="font-display text-xl font-semibold text-navy">
            {content.externalSite.headline}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-anthracite/85">
            {content.externalSite.body}
          </p>
          <a
            href={bayrenoSite}
            className="mt-4 inline-block font-semibold text-gold-deep hover:underline"
            rel="me"
          >
            {content.externalSite.linkLabel} →
          </a>
        </div>
      </Section>

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
              <span aria-hidden="true" className="mt-3 inline-block font-semibold text-gold-deep">
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
