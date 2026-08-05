import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getEntruempelung, getSiteData } from "@/lib/content";
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
  return pageMetadata(locale, "/entruempelung", getEntruempelung(locale).meta);
}

export default async function EntruempelungPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getEntruempelung(locale);
  const common = getCommon(locale);
  const site = getSiteData();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Entrümpelung München",
    provider: {
      "@type": "LocalBusiness",
      name: "Super Entrümpelung",
      telephone: site.organization.phone,
    },
    areaServed: { "@type": "City", name: "München" },
    description:
      "Entrümpelung und Haushaltsauflösung in München mit fachgerechter Entsorgung und besenreiner Übergabe.",
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />

      <Hero
        content={content.hero}
        character={common.characters.entruempelung}
        actions={
          <>
            <CallbackButton topic="entruempelung" className={btnPrimary}>
              {content.hero.primaryCta}
            </CallbackButton>
            <a href="#ablauf" className={btnOutlineOnDark}>
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

      {/* Process */}
      <Section variant="navy" id="ablauf">
        <SectionHeading onDark>{content.process.headline}</SectionHeading>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <PlaceholderImage
            label="[BILD: Besenreine, leere Wohnung nach Entrümpelung — helle Räume]"
            className="aspect-[4/3] lg:order-2"
          />
          <ol className="space-y-5">
            {content.process.steps.map((step, index) => (
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
      </Section>

      <ChatCta content={common.chatCta} />

      <Section variant="cream">
        <Faq headline={content.faq.headline} items={content.faq.items} />
      </Section>
    </>
  );
}
