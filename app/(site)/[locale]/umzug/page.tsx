import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getSiteData, getUmzug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { CallbackButton } from "@/components/CallbackButton";
import { ChatCta } from "@/components/ChatCta";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/umzug", getUmzug(locale).meta);
}

export default async function UmzugPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getUmzug(locale);
  const common = getCommon(locale);
  const site = getSiteData();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Umzug München",
    provider: {
      "@type": "MovingCompany",
      name: "Super Umzug",
      telephone: site.organization.phone,
    },
    areaServed: { "@type": "City", name: "München" },
    description:
      "Private und gewerbliche Umzüge in München mit Unbeschädigt-Garantie und voller Werterstattung im Schadensfall.",
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />

      <Hero
        content={content.hero}
        actions={
          <>
            <CallbackButton topic="umzug" className={btnPrimary}>
              {content.hero.primaryCta}
            </CallbackButton>
            <a href="#garantie" className={btnOutlineOnDark}>
              {content.hero.secondaryCta}
            </a>
          </>
        }
      />

      {/* Services */}
      <Section variant="cream">
        <SectionHeading>{content.services.headline}</SectionHeading>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.services.items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-hairline bg-white p-6 shadow-card"
            >
              <h3 className="font-display text-lg font-semibold text-navy">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-anthracite/85">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Damage-free guarantee — the flagship promise */}
      <Section variant="navy" id="garantie">
        <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white/5 px-4 py-1.5 text-sm font-semibold text-gold">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
            <path
              d="M7 .5 13.5 3v4.5c0 3.9-2.8 6.9-6.5 8-3.7-1.1-6.5-4.1-6.5-8V3L7 .5Z"
              fill="currentColor"
              opacity="0.5"
            />
            <path
              d="m4.5 8 1.8 1.8L9.8 6.3"
              stroke="#0E1F3C"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {content.guarantee.badge}
        </p>
        <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
              {content.guarantee.headline}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              {content.guarantee.lead}
            </p>
            <PlaceholderImage
              label="[BILD: Team dokumentiert Möbelzustand mit Tablet vor dem Transport]"
              className="mt-8 aspect-video"
            />
          </div>
          <ol className="space-y-5">
            {content.guarantee.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 font-display text-sm font-semibold text-gold"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-white/70">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-10 max-w-3xl border-t border-white/15 pt-5 text-sm text-white/50">
          {content.guarantee.finePrint}
        </p>
      </Section>

      <ChatCta content={common.chatCta} />

      <Section variant="cream">
        <Faq headline={content.faq.headline} items={content.faq.items} />
      </Section>
    </>
  );
}
