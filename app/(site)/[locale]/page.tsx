import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCommon, getHome, getProjects, getSiteData } from "@/lib/content";
import {
  absoluteUrl,
  localBusinessSchema,
  personSchema,
  servicesItemListSchema,
  websiteSchema,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnOutlineOnLight, btnPrimary } from "@/lib/styles";
import { CallbackButton } from "@/components/CallbackButton";
import { CallbackForm } from "@/components/CallbackForm";
import { ChatCta } from "@/components/ChatCta";
import { ChatCtaButton } from "@/components/ChatCtaButton";
import { Hero } from "@/components/Hero";
import { ProjectsGallery } from "@/components/ProjectsGallery";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { Section, SectionHeading } from "@/components/Section";
import { Faq } from "@/components/Faq";

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
  const projects = getProjects(locale);
  const site = getSiteData();

  const localBusinessJsonLd = localBusinessSchema(locale);
  const personJsonLd = personSchema();
  const servicesJsonLd = servicesItemListSchema(locale);
  const websiteJsonLd = websiteSchema(locale);

  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={personJsonLd} />
      <JsonLd data={servicesJsonLd} />
      <JsonLd data={websiteJsonLd} />

      <Hero
        content={home.hero}
        badges={home.badges}
        character={common.characters.bayreno}
        actions={
          <>
            <CallbackButton className={btnPrimary}>
              {home.hero.primaryCta}
            </CallbackButton>
            <Link href="/komplettservice" className={btnOutlineOnDark}>
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
                // The card's heading is the brand name, so where a brand has
                // its own page this link carries the name as anchor text.
                href={brand.brandPage ?? brand.href}
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

      {/* Projects — proof of work, right after the brands are introduced */}
      <Section variant="light" id="projekte">
        <SectionHeading intro={projects.intro}>{projects.headline}</SectionHeading>
        <ProjectsGallery content={projects} />
      </Section>

      {/* Inspection service — flat-fee offer, high intent */}
      <Section variant="cream" id="besichtigungsservice">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div>
            <SectionHeading eyebrowText={home.inspection.eyebrow}>
              {home.inspection.headline}
            </SectionHeading>
            <p className="mt-4 text-lg leading-relaxed text-anthracite/80">
              {home.inspection.body}
            </p>
            <ul className="mt-6 space-y-2.5">
              {home.inspection.includes.map((item) => (
                <li key={item} className="flex gap-3 text-anthracite/90">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-gold-deep"
                  >
                    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="m5.5 9 2.3 2.3L12.5 6.6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Price card */}
          <div className="rounded-xl border-2 border-gold bg-navy p-8 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              {home.inspection.priceLabel}
            </p>
            <p className="mt-2 font-display text-5xl font-semibold text-white">
              {home.inspection.price}
            </p>
            <p className="mt-3 leading-relaxed text-white/70">
              {home.inspection.priceNote}
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <a
                href={`tel:${site.organization.phone.replace(/[^+0-9]/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M6.2 3.3 7.5 6 6.1 7.4a9.5 9.5 0 0 0 4.5 4.5L12 10.5l2.7 1.3v3c0 .6-.5 1.1-1.1 1A12.6 12.6 0 0 1 2.2 4.4c-.1-.6.4-1.1 1-1.1h3Z"
                    fill="currentColor"
                  />
                </svg>
                {home.inspection.orderCta}
              </a>
              <p className="text-center text-sm text-white/60">
                {site.organization.phone}
              </p>
              <ChatCtaButton className="inline-flex items-center justify-center gap-2 rounded-lg border-[1.5px] border-white/70 px-6 py-3 font-semibold text-white transition-colors hover:border-gold hover:text-gold">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M9 1.5c-4.14 0-7.5 2.86-7.5 6.38 0 1.98 1.06 3.75 2.72 4.92-.1.86-.44 1.94-1.22 2.7 1.53-.1 2.76-.68 3.6-1.28.76.22 1.57.34 2.4.34 4.14 0 7.5-2.86 7.5-6.38S13.14 1.5 9 1.5Z"
                    fill="currentColor"
                  />
                </svg>
                {home.inspection.askCta}
              </ChatCtaButton>
            </div>
          </div>
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
              href="/komplettservice"
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
          <Photo
            src="/images/b2b-handshake.jpg"
            alt={home.b2bSection.imageAlt}
            className="aspect-[4/3]"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
      </Section>

      <Section variant="light">
        <Faq
          headline={home.faq.headline}
          items={home.faq.items}
          pageUrl={absoluteUrl(locale, "/")}
        />
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
