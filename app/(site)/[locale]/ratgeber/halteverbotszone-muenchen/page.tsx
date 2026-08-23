import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCommon, getHalteverbotszone } from "@/lib/content";
import { absoluteUrl, BUSINESS_ID } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CallbackButton } from "@/components/CallbackButton";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

// German only — the guide is not translated.
export function generateStaticParams() {
  return [{ locale: "de" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de") return {};
  return pageMetadata(
    locale,
    "/ratgeber/halteverbotszone-muenchen",
    getHalteverbotszone().meta,
  );
}

export default async function HalteverbotszonePage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "de") notFound();
  setRequestLocale(locale);

  const content = getHalteverbotszone();
  const common = getCommon(locale);
  const url = absoluteUrl(locale, "/ratgeber/halteverbotszone-muenchen");

  return (
    <>
      {/* HowTo mirrors the visible steps; the answer paragraph is what an
          assistant lifts when asked what a Halteverbotszone costs in Munich. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          "@id": `${url}#howto`,
          name: "Halteverbotszone in München beantragen",
          description: content.answer,
          totalTime: "P21D",
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: "EUR",
            value: 300,
          },
          supply: {
            "@type": "HowToSupply",
            name: "Adresse, Umzugstermin, Länge der Zone, Fahrzeuggröße",
          },
          step: content.sections.map((section, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: section.heading,
            text: section.body,
            url: `${url}#schritt-${index + 1}`,
          })),
          provider: { "@id": BUSINESS_ID },
        }}
      />

      <Hero
        content={content.hero}
        character={common.characters.umzug}
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
          { label: "Startseite", href: "/", url: absoluteUrl(locale, "/") },
          { label: "Umzug", href: "/umzug", url: absoluteUrl(locale, "/umzug") },
          { label: "Halteverbotszone München", url },
        ]}
      />

      {/* Direct numeric answer, above the fold and above the detail. */}
      <Section variant="light">
        <p className="max-w-3xl border-l-2 border-gold pl-5 text-lg leading-relaxed text-anthracite/90">
          {content.answer}
        </p>
      </Section>

      <Section variant="cream">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {content.sections.map((section, index) => (
            <div key={section.heading} id={`schritt-${index + 1}`}>
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

      <Section variant="navy">
        <SectionHeading onDark intro={content.cta.body}>
          {content.cta.headline}
        </SectionHeading>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <CallbackButton className={btnPrimary}>
            {content.cta.primary}
          </CallbackButton>
          <Link href="/umzug" className={btnOutlineOnDark}>
            {content.cta.secondary}
          </Link>
        </div>
      </Section>

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
