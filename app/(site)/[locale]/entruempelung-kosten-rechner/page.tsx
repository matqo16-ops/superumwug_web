import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCommon, getEntruempelung, getRechner } from "@/lib/content";
import {
  entruempelungRates,
  estimateEntruempelung,
  fillTemplate,
  formatBand,
  formatPercentBand,
} from "@/lib/estimate";
import { absoluteUrl } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CallbackButton } from "@/components/CallbackButton";
import { EntruempelungCalculator } from "@/components/CostCalculator";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

const FLOORS = [0, 1, 2, 3, 4];

// German only — the calculator is not translated.
export function generateStaticParams() {
  return [{ locale: "de" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de") return {};
  return pageMetadata(locale, "/entruempelung-kosten-rechner", getRechner().entruempelung.meta);
}

export default async function EntruempelungKostenRechnerPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "de") notFound();
  setRequestLocale(locale);

  const content = getRechner().entruempelung;
  const pricing = getEntruempelung(locale).pricing;
  const common = getCommon(locale);
  const rates = entruempelungRates(pricing);
  const url = absoluteUrl(locale, "/entruempelung-kosten-rechner");

  const cell = (object: number, floors: number) =>
    formatBand(
      estimateEntruempelung(rates, { object, floors, hazardous: false, zone: false, cleaningM2: 0 }),
    );

  const twoRoom = rates.rows.findIndex((r) => /2-Zimmer/.test(r.label));
  if (twoRoom < 0) throw new Error("Entrümpelung table has no 2-Zimmer row");

  const floor = formatPercentBand(rates.floor);
  const answer = fillTemplate(content.answer, {
    base: cell(twoRoom, 0),
    cellar: cell(0, 0),
    floor,
    hazardous: formatBand(rates.hazardous),
    zone: formatBand(rates.zone),
  });

  return (
    <>
      <Hero
        content={content.hero}
        character={common.characters.entruempelung}
        actions={
          <>
            <CallbackButton className={btnPrimary}>{content.hero.primaryCta}</CallbackButton>
            <Link href="/entruempelung" className={btnOutlineOnDark}>
              {content.hero.secondaryCta}
            </Link>
          </>
        }
      />

      <Breadcrumbs
        label="Breadcrumb"
        items={[
          { label: "Startseite", href: "/", url: absoluteUrl(locale, "/") },
          {
            label: "Entrümpelung",
            href: "/entruempelung",
            url: absoluteUrl(locale, "/entruempelung"),
          },
          { label: "Entrümpelung Kosten-Rechner", url },
        ]}
      />

      <Section variant="light">
        <p className="max-w-3xl border-l-2 border-gold pl-5 text-lg leading-relaxed text-anthracite/90">
          {answer}
        </p>
        <div className="mt-10">
          <EntruempelungCalculator rates={rates} content={content.calculator} />
        </div>
      </Section>

      <Section variant="cream">
        <SectionHeading intro={fillTemplate(content.matrix.intro, { floor })}>
          {content.matrix.headline}
        </SectionHeading>
        <div className="mt-8 overflow-x-auto rounded-xl border border-hairline bg-white shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm md:text-base">
            <caption className="sr-only">
              Entrümpelung Kosten München nach Objekt und Etagen ohne Aufzug, brutto inkl. 19 % MwSt. — Preistabelle von Entrümpelung München (mmoving.de)
            </caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {pricing.columns[0]}
                </th>
                {FLOORS.map((n) => (
                  <th key={n} scope="col" className="px-4 py-3 font-semibold">
                    {n === 0 ? `EG / Aufzug` : `${n}. OG`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rates.rows.map((row, index) => (
                <tr key={row.label}>
                  <th scope="row" className="px-4 py-3 font-medium text-navy">
                    {row.label}
                    <span className="block text-sm font-normal text-anthracite/70">{row.detail}</span>
                  </th>
                  {FLOORS.map((n) => (
                    <td key={n} className="px-4 py-3">
                      {cell(index, n)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-anthracite/70">{content.matrix.floorsHeading}: {floor} je Etage.</p>
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
          <Link href="/entruempelung" className={btnOutlineOnDark}>
            {content.cta.secondary}
          </Link>
        </div>
      </Section>
    </>
  );
}
