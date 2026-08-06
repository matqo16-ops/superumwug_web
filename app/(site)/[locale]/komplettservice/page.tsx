import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getKomplettservice, getSiteData } from "@/lib/content";
import { absoluteUrl, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { CallbackButton } from "@/components/CallbackButton";
import { ChatCta } from "@/components/ChatCta";
import { ChatCtaButton } from "@/components/ChatCtaButton";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import {
  AreasServed,
  CrossLinks,
  EntityFacts,
  ServiceLead,
} from "@/components/ServiceSections";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/komplettservice", getKomplettservice(locale).meta);
}

export default async function PaketePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getKomplettservice(locale);
  const common = getCommon(locale);
  const site = getSiteData();
  const { labels } = content;

  return (
    <>
      <JsonLd
        data={serviceSchema({
          locale,
          href: "/komplettservice",
          serviceType:
            locale === "de"
              ? "Komplettservice Umzug, Entrümpelung und Renovierung München"
              : "Full service moving, clearance and renovation Munich",
          name: content.meta.title,
          description: content.lead,
          offers: content.packages.map((pkg) => ({
            name: pkg.name,
            description: pkg.forWhom,
          })),
        })}
      />

      <Hero content={content.hero} />

      <Breadcrumbs
        label="Breadcrumb"
        items={[
          {
            label: locale === "de" ? "Startseite" : "Home",
            href: "/",
            url: absoluteUrl(locale, "/"),
          },
          {
            label: locale === "de" ? "Komplettservice" : "Full service",
            url: absoluteUrl(locale, "/komplettservice"),
          },
        ]}
      />

      <Section variant="light">
        <ServiceLead text={content.lead} />
      </Section>

      {/* Sequence — the order the three trades run in */}
      <Section variant="cream">
        <SectionHeading intro={content.sequence.intro}>
          {content.sequence.headline}
        </SectionHeading>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.sequence.steps.map((step) => (
            <li
              key={step.title}
              className="rounded-xl border border-hairline bg-white p-6 shadow-card"
            >
              <h3 className="font-display text-lg font-semibold text-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-anthracite/85">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section variant="cream">
        <div className="grid gap-8 lg:grid-cols-2">
          {content.packages.map((pkg) => (
            <article
              key={pkg.id}
              id={pkg.id}
              className="flex flex-col rounded-xl border border-hairline bg-white p-8 shadow-card"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {pkg.kicker}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
                {pkg.name}
              </h2>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-anthracite/60">
                {labels.forWhom}
              </h3>
              <p className="mt-1.5 leading-relaxed text-anthracite/90">
                {pkg.forWhom}
              </p>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-anthracite/60">
                {labels.included}
              </h3>
              <ol className="mt-3 space-y-3">
                {pkg.included.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy font-display text-xs font-semibold text-gold"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-navy">
                        {step.title}
                      </span>
                      <p className="text-sm leading-relaxed text-anthracite/80">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-anthracite/60">
                {labels.outcome}
              </h3>
              <p className="mt-1.5 leading-relaxed text-anthracite/90">
                {pkg.outcome}
              </p>

              <div className="mt-auto border-t border-hairline pt-6">
                <p className="mt-2 text-sm font-medium text-anthracite/70">
                  {labels.priceCtaLine}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <ChatCtaButton className="inline-flex items-center justify-center rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white">
                    {labels.chatButton}
                  </ChatCtaButton>
                  <CallbackButton
                    topic={pkg.id}
                    className="inline-flex items-center justify-center rounded-lg border-[1.5px] border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-gold-deep hover:text-gold-deep"
                  >
                    {labels.callbackButton}
                  </CallbackButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Bonus service — visually separate from the packages above */}
      <Section variant="light" id="besichtigungsservice">
        <div className="rounded-xl border-2 border-dashed border-gold/70 bg-cream p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-navy">
              {content.bonus.eyebrow}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-anthracite/60">
              {content.bonus.badge}
            </span>
          </div>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
                {content.bonus.name}
              </h2>
              <p className="mt-3 leading-relaxed text-anthracite/85">
                {content.bonus.body}
              </p>
              <ul className="mt-5 space-y-2.5">
                {content.bonus.includes.map((item) => (
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

            <div className="rounded-xl bg-navy p-7 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                {content.bonus.priceLabel}
              </p>
              <p className="mt-1 font-display text-5xl font-semibold text-white">
                {content.bonus.price}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {content.bonus.priceNote}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={`tel:${site.organization.phone.replace(/[^+0-9]/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-3 font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white"
                >
                  {content.bonus.orderCta}
                </a>
                <ChatCtaButton className="inline-flex items-center justify-center gap-2 rounded-lg border-[1.5px] border-white/70 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold">
                  {content.bonus.askCta}
                </ChatCtaButton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Savings comparison */}
      <Section variant="light" id="ersparnis">
        <SectionHeading intro={content.savings.intro}>
          {content.savings.headline}
        </SectionHeading>
        <div className="mt-8 overflow-x-auto rounded-xl border border-hairline bg-white shadow-card">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-left text-white">
                {content.savings.columns.map((column) => (
                  <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.savings.rows.map((row) => (
                <tr key={row[0]} className="border-t border-hairline even:bg-cream/60">
                  {row.map((cell, index) => (
                    <td
                      key={index}
                      className={`px-4 py-3 align-top ${
                        index === row.length - 1
                          ? "font-semibold text-navy"
                          : "text-anthracite/85"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-3xl border-l-2 border-gold pl-4 text-sm leading-relaxed text-anthracite/70">
          {content.savings.note}
        </p>
      </Section>

      <AreasServed content={content.areas} />

      <ChatCta content={common.chatCta} />

      <Section variant="cream">
        <Faq
          headline={content.faq.headline}
          items={content.faq.items}
          pageUrl={absoluteUrl(locale, "/komplettservice")}
        />
      </Section>

      <EntityFacts content={content.entity} />
      <CrossLinks content={content.crossLinks} />
    </>
  );
}
