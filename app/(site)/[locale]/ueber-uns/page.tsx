import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCommon, getUeberUns } from "@/lib/content";
import { absoluteUrl, personSchema } from "@/lib/schema";
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
  return pageMetadata(locale, "/ueber-uns", getUeberUns(locale).meta);
}

export default async function UeberUnsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getUeberUns(locale);
  const common = getCommon(locale);
  const url = absoluteUrl(locale, "/ueber-uns");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": `${url}#aboutpage`,
          url,
          name: content.meta.title,
          description: content.meta.description,
          mainEntity: { "@id": `${absoluteUrl(locale, "/")}#business` },
        }}
      />
      <JsonLd data={personSchema()} />

      <Hero
        content={content.hero}
        character={common.characters.bayreno}
        actions={
          <>
            <CallbackButton className={btnPrimary}>
              {content.hero.primaryCta}
            </CallbackButton>
            <Link href="/umzug" className={btnOutlineOnDark}>
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
          { label: content.hero.eyebrow, url },
        ]}
      />

      {/* The extractable one-entity sentence, first thing on the page. */}
      <Section variant="light">
        <p className="max-w-3xl text-lg leading-relaxed text-anthracite/90">
          {content.lead}
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

      <ChatCta content={common.chatCta} />

      <Section variant="light">
        <Faq headline={content.faq.headline} items={content.faq.items} pageUrl={url} />
      </Section>
    </>
  );
}
