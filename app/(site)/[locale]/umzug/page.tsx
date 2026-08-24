import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getSiteData, getUmzug } from "@/lib/content";
import { absoluteUrl, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { CallbackButton } from "@/components/CallbackButton";
import { ChatCta } from "@/components/ChatCta";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { Section, SectionHeading } from "@/components/Section";
import {
  AreasServed,
  CrossLinks,
  EntityFacts,
  PricingTable,
  ServiceDetail,
  ServiceLead,
  Situations,
} from "@/components/ServiceSections";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StadtteilDirectory } from "@/components/StadtteilDirectory";

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

  const serviceJsonLd = serviceSchema({
    locale,
    href: "/umzug",
    serviceType: locale === "de" ? "Umzug München" : "Moving Munich",
    name: content.meta.title,
    description: content.lead,
    offers: content.services.items.map((item) => ({
      name: item.title,
      description: item.body,
    })),
  });

  return (
    <>
      <JsonLd data={serviceJsonLd} />

      <Hero
        content={content.hero}
        character={common.characters.umzug}
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

      <Breadcrumbs
        label={locale === "de" ? "Breadcrumb" : "Breadcrumb"}
        items={[
          {
            label: locale === "de" ? "Startseite" : "Home",
            href: "/",
            url: absoluteUrl(locale, "/"),
          },
          {
            label: locale === "de" ? "Umzug" : "Moving",
            url: absoluteUrl(locale, "/umzug"),
          },
        ]}
      />

      {/* Services */}
      <Section variant="cream">
        <SectionHeading>{content.services.headline}</SectionHeading>
        <div className="mt-4">
          <ServiceLead text={content.lead} />
        </div>
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

      {/* Liability and insurance — statutory position, deliberately not a guarantee */}
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
            <Photo
              src="/images/garantie-dokumentation.jpg"
              alt={content.guarantee.imageAlt}
              className="mt-8 aspect-video"
              sizes="(min-width: 1024px) 55vw, 100vw"
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

      <ServiceDetail content={content.detail} />

      {/* Process */}
      <Section variant="cream">
        <SectionHeading>{content.process.headline}</SectionHeading>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.process.steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-hairline bg-white p-6 shadow-card"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-display text-sm font-semibold text-gold"
              >
                {index + 1}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-anthracite/85">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <PricingTable content={content.pricing} />
      <Situations content={content.situations} />
      <AreasServed content={content.areas} />
      {locale === "de" && <StadtteilDirectory />}

      <ChatCta content={common.chatCta} />

      <Section variant="cream">
        <Faq
          headline={content.faq.headline}
          items={content.faq.items}
          pageUrl={absoluteUrl(locale, "/umzug")}
        />
      </Section>

      <EntityFacts content={content.entity} />
      <CrossLinks content={content.crossLinks} />
    </>
  );
}
