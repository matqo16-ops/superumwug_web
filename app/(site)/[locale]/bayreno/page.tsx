import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getBayreno, getCommon, getSiteData } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnOutlineOnLight, btnPrimary } from "@/lib/styles";
import { CallbackButton } from "@/components/CallbackButton";
import { ChatCta } from "@/components/ChatCta";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/bayreno", getBayreno(locale).meta);
}

export default async function BayrenoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getBayreno(locale);
  const common = getCommon(locale);
  const site = getSiteData();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Renovierung München",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "BayReno — Bayerische Renovierung",
      telephone: site.organization.phone,
    },
    areaServed: { "@type": "City", name: "München" },
    description:
      "Renovierung und Sanierung in München: Maler-, Boden-, Bad- und Trockenbauarbeiten sowie Komplettsanierungen — termintreu und aus einer Hand.",
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />

      <Hero
        content={content.hero}
        character={common.characters.bayreno}
        actions={
          <>
            <CallbackButton topic="renovierung" className={btnPrimary}>
              {content.hero.primaryCta}
            </CallbackButton>
            <a href="#leistungen" className={btnOutlineOnDark}>
              {content.hero.secondaryCta}
            </a>
          </>
        }
      />

      {/* Services */}
      <Section variant="cream" id="leistungen">
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
      <Section variant="navy">
        <SectionHeading onDark>{content.process.headline}</SectionHeading>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="mt-1 leading-relaxed text-white/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Combination with the other two brands */}
      <Section variant="light">
        <SectionHeading intro={content.combo.body}>
          {content.combo.headline}
        </SectionHeading>
        <Link href="/pakete" className={`${btnOutlineOnLight} mt-8`}>
          {content.combo.cta}
        </Link>
      </Section>

      <ChatCta content={common.chatCta} />

      <Section variant="cream">
        <Faq headline={content.faq.headline} items={content.faq.items} />
      </Section>
    </>
  );
}
