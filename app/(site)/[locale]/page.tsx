import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCommon, getHome, getSiteData } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnOutlineOnLight, btnPrimary } from "@/lib/styles";
import { CallbackButton } from "@/components/CallbackButton";
import { CallbackForm } from "@/components/CallbackForm";
import { ChatCta } from "@/components/ChatCta";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/", getHome(locale).meta);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const home = getHome(locale);
  const common = getCommon(locale);
  const site = getSiteData();

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: site.organization.name,
    alternateName: ["Super Entrümpelung"],
    url: `${site.siteUrl}/`,
    telephone: site.organization.phone,
    email: site.organization.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.organization.streetAddress,
      addressLocality: site.organization.addressLocality,
      postalCode: site.organization.postalCode,
      addressCountry: site.organization.addressCountry,
    },
    areaServed: { "@type": "City", name: "München" },
    sameAs: [site.bayrenoUrl],
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Umzug München" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entrümpelung München" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Haushaltsauflösung München" } },
    ],
  };

  return (
    <>
      <JsonLd data={localBusinessJsonLd} />

      <Hero
        content={home.hero}
        badges={home.badges}
        character={common.characterAlt}
        actions={
          <>
            <CallbackButton className={btnPrimary}>
              {home.hero.primaryCta}
            </CallbackButton>
            <Link href="/pakete" className={btnOutlineOnDark}>
              {home.hero.secondaryCta}
            </Link>
          </>
        }
      />

      {/* The three brands */}
      <Section variant="cream">
        <SectionHeading>{home.brandsSection.headline}</SectionHeading>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {home.brandsSection.cards.map((card) => {
            const brand = common.brands.find(
              (entry) => entry.id === card.brandId,
            )!;
            return (
              <Link
                key={card.brandId}
                href={brand.href}
                className="group block rounded-xl border border-hairline bg-white p-7 shadow-card transition-colors hover:border-gold"
              >
                <h3 className="font-display text-xl font-semibold text-navy group-hover:text-gold-deep">
                  {brand.name}
                </h3>
                <p className="mt-3 leading-relaxed text-anthracite/85">
                  {card.body}
                </p>
                <span className="mt-4 inline-block font-semibold text-gold-deep">
                  {card.cta} →
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Packages teaser */}
      <Section variant="navy">
        <SectionHeading onDark intro={home.packagesSection.intro}>
          {home.packagesSection.headline}
        </SectionHeading>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {home.packagesSection.cards.map((card) => (
            <Link
              key={card.title}
              href="/pakete"
              className="group rounded-xl border border-white/15 bg-white/5 p-7 transition-colors hover:border-gold"
            >
              <h3 className="font-display text-xl font-semibold text-white group-hover:text-gold">
                {card.title}
              </h3>
              <p className="mt-3 leading-relaxed text-white/70">{card.body}</p>
              <span className="mt-4 inline-block font-semibold text-gold">
                {home.packagesSection.cta} →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* B2B teaser */}
      <Section variant="light">
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading intro={home.b2bSection.body}>
              {home.b2bSection.headline}
            </SectionHeading>
            <Link href="/b2b" className={`${btnOutlineOnLight} mt-8`}>
              {home.b2bSection.cta}
            </Link>
          </div>
          <PlaceholderImage
            label="[BILD: Handschlag / Übergabe von Schlüsseln — B2B-Partnerschaft]"
            className="aspect-[4/3]"
          />
        </div>
      </Section>

      <ChatCta content={common.chatCta} />

      {/* Inline callback form */}
      <Section variant="cream" id="rueckruf">
        <div className="mx-auto max-w-xl">
          <SectionHeading intro={home.callbackSection.body}>
            {home.callbackSection.headline}
          </SectionHeading>
          <div className="mt-8 rounded-xl border border-hairline bg-white p-6 shadow-card sm:p-8">
            <CallbackForm form={common.callbackForm} idPrefix="home" />
          </div>
        </div>
      </Section>
    </>
  );
}
