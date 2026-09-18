import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCommon, getRechner, getUmzug } from "@/lib/content";
import {
  estimateUmzug,
  fillTemplate,
  formatBand,
  umzugRates,
} from "@/lib/estimate";
import { absoluteUrl } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CallbackButton } from "@/components/CallbackButton";
import { UmzugCalculator } from "@/components/CostCalculator";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

// German only — the calculator is not translated.
export function generateStaticParams() {
  return [{ locale: "de" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de") return {};
  return pageMetadata(locale, "/umzugskosten-rechner", getRechner().umzug.meta);
}

export default async function UmzugskostenRechnerPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "de") notFound();
  setRequestLocale(locale);

  const content = getRechner().umzug;
  const pricing = getUmzug(locale).pricing;
  const common = getCommon(locale);
  const rates = umzugRates(pricing);
  const url = absoluteUrl(locale, "/umzugskosten-rechner");

  const noExtras = { material: false, fullPacking: false, furniture: false, kitchen: false };
  const cell = (size: number, zones: number, extras = noExtras) =>
    formatBand(estimateUmzug(rates, { size, zones, ...extras }));

  const answer = fillTemplate(content.answer, {
    base: cell(1, 0),
    zone: formatBand(rates.zone),
    withZones: cell(1, 2),
  });

  return (
    <>
      <Hero
        content={content.hero}
        character={common.characters.umzug}
        actions={
          <>
            <CallbackButton className={btnPrimary}>{content.hero.primaryCta}</CallbackButton>
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
          { label: "Umzugskosten-Rechner", url },
        ]}
      />

      {/* Direct numeric answer first — the sentence an assistant lifts. */}
      <Section variant="light">
        <p className="max-w-3xl border-l-2 border-gold pl-5 text-lg leading-relaxed text-anthracite/90">
          {answer}
        </p>
        <div className="mt-10">
          <UmzugCalculator rates={rates} content={content.calculator} />
        </div>
      </Section>

      {/* The full matrix, server-rendered: crawlers and assistants read this,
          not the interactive calculator above. */}
      <Section variant="cream">
        <SectionHeading intro={fillTemplate(content.matrix.intro, { zone: formatBand(rates.zone) })}>
          {content.matrix.headline}
        </SectionHeading>
        <div className="mt-8 overflow-x-auto rounded-xl border border-hairline bg-white shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm md:text-base">
            <caption className="sr-only">
              Umzugskosten München nach Wohnungsgröße, brutto inkl. 19 % MwSt. — Preistabelle von SuperUmzug (mmoving.de)
            </caption>
            <thead className="bg-navy text-white">
              <tr>
                {content.matrix.columns.map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rates.rows.map((row, index) => (
                <tr key={row.label}>
                  <th scope="row" className="px-4 py-3 font-medium text-navy">
                    {row.label}
                  </th>
                  <td className="px-4 py-3">{cell(index, 0)}</td>
                  <td className="px-4 py-3">{cell(index, 1)}</td>
                  <td className="px-4 py-3">{cell(index, 2)}</td>
                  <td className="px-4 py-3">
                    {cell(index, 2, { ...noExtras, fullPacking: true, furniture: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-anthracite/75">{pricing.note}</p>
      </Section>

      <Section variant="light">
        <SectionHeading intro={content.method.body}>{content.method.headline}</SectionHeading>
        <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-anthracite/90">
          {pricing.extras.map((extra) => (
            <li key={extra}>{extra}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl leading-relaxed text-anthracite/85">{content.method.excluded}</p>
      </Section>

      <Section variant="cream">
        <Faq headline={content.faq.headline} items={content.faq.items} pageUrl={url} />
      </Section>

      <Section variant="navy">
        <SectionHeading onDark intro={content.cta.body}>
          {content.cta.headline}
        </SectionHeading>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <CallbackButton className={btnPrimary}>{content.cta.primary}</CallbackButton>
          <Link href="/umzug" className={btnOutlineOnDark}>
            {content.cta.secondary}
          </Link>
        </div>
      </Section>
    </>
  );
}
