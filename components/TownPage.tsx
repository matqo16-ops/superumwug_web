import { Link } from "@/i18n/navigation";
import type { Locale, StaticPathname } from "@/i18n/routing";
import type {
  CharacterImage,
  ServiceSeoContent,
  TownPageContent,
} from "@/lib/content-types";
import { getSiteData } from "@/lib/content";
import { absoluteUrl, BUSINESS_ID } from "@/lib/schema";
import { telHref } from "@/lib/phone";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "./Breadcrumbs";
import { CallbackButton } from "./CallbackButton";
import { Faq } from "./Faq";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { Section, SectionHeading } from "./Section";
import { PricingTable } from "./ServiceSections";

/**
 * A service page for one town outside Munich. The business is based in
 * Germering, so the page leads with that — a visitable address, hours and a
 * phone line in the town itself are the local signal a template competitor
 * cannot copy — then the town's own rules and sources, then the published
 * price table from the service hub, unchanged.
 */
export function TownPage({
  locale,
  href,
  town,
  content,
  answer,
  pricing,
  character,
  service,
  calculatorHref,
}: {
  locale: Locale;
  href: StaticPathname;
  town: string;
  content: TownPageContent;
  /** content.answer with its placeholders already filled. */
  answer: string;
  pricing: ServiceSeoContent["pricing"];
  character: CharacterImage;
  service: { label: string; href: StaticPathname; serviceType: string };
  calculatorHref: StaticPathname;
}) {
  const site = getSiteData();
  const location = site.businessLocation;
  const url = absoluteUrl(locale, href);
  const phone = site.organization.brandPhones.superumzug;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${url}#service`,
          serviceType: service.serviceType,
          name: content.hero.headline,
          description: answer,
          url,
          provider: { "@id": BUSINESS_ID },
          areaServed: {
            "@type": "City",
            name: town,
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: "Landkreis Fürstenfeldbruck",
            },
          },
          availableChannel: {
            "@type": "ServiceChannel",
            servicePhone: phone,
            serviceLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                streetAddress: location.streetAddress,
                postalCode: location.postalCode,
                addressLocality: location.addressLocality,
                addressCountry: location.addressCountry,
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: location.latitude,
                longitude: location.longitude,
              },
            },
          },
        }}
      />

      <Hero
        content={content.hero}
        character={character}
        actions={
          <>
            <CallbackButton className={btnPrimary}>{content.hero.primaryCta}</CallbackButton>
            <Link href={calculatorHref} className={btnOutlineOnDark}>
              {content.hero.secondaryCta}
            </Link>
          </>
        }
      />

      <Breadcrumbs
        label="Breadcrumb"
        items={[
          { label: "Startseite", href: "/", url: absoluteUrl(locale, "/") },
          { label: service.label, href: service.href, url: absoluteUrl(locale, service.href) },
          { label: town, url },
        ]}
      />

      <Section variant="light">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <p className="border-l-2 border-gold pl-5 text-lg leading-relaxed text-anthracite/90">
            {answer}
          </p>
          {/* The visitable business in the town itself. */}
          <address className="rounded-xl border border-hairline bg-cream p-6 not-italic shadow-card">
            <p className="font-display text-lg font-semibold text-navy">{site.organization.businessName}</p>
            <p className="mt-2 text-anthracite/85">
              {location.streetAddress}
              <br />
              {location.postalCode} {location.addressLocality}
            </p>
            <p className="mt-2 text-anthracite/85">Mo–Fr 8–18 Uhr, Sa 9–14 Uhr</p>
            <a
              href={telHref(phone)}
              className="mt-3 block font-semibold text-navy underline decoration-gold underline-offset-4 hover:text-gold-deep"
            >
              {phone}
            </a>
            <a
              href={site.googleBusinessProfile}
              className="mt-2 block text-sm text-anthracite/80 underline decoration-gold/50 underline-offset-4 hover:text-gold-deep"
              rel="noopener"
            >
              Auf Google Maps ansehen
            </a>
          </address>
        </div>
      </Section>

      <Section variant="cream">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-navy">{section.heading}</h2>
              <p className="mt-3 leading-relaxed text-anthracite/85">{section.body}</p>
              {section.source && (
                <p className="mt-2 text-sm text-anthracite/65">
                  Quelle:{" "}
                  <a
                    href={section.source.url}
                    rel="noopener"
                    className="underline decoration-gold/50 underline-offset-4 hover:text-gold-deep"
                  >
                    {section.source.label}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Same table as the service hub; only the heading names the town. */}
      <PricingTable content={{ ...pricing, headline: `${service.label}: Preise für ${town} und Umgebung` }} />

      <Section variant="light">
        <Faq headline={content.faq.headline} items={content.faq.items} pageUrl={url} />
      </Section>

      <Section variant="cream">
        <SectionHeading>Weiterlesen</SectionHeading>
        <ul className="mt-6 flex flex-wrap gap-3">
          {content.related.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-block rounded-lg border border-hairline bg-white px-4 py-2 font-medium text-navy shadow-card hover:border-gold hover:text-gold-deep"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section variant="navy">
        <SectionHeading onDark intro={content.cta.body}>
          {content.cta.headline}
        </SectionHeading>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <CallbackButton className={btnPrimary}>{content.cta.primary}</CallbackButton>
          <Link href={service.href} className={btnOutlineOnDark}>
            {content.cta.secondary}
          </Link>
        </div>
      </Section>
    </>
  );
}
