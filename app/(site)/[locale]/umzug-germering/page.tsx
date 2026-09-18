import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getOrt, getUmzug } from "@/lib/content";
import { estimateUmzug, fillTemplate, formatBand, umzugRates } from "@/lib/estimate";
import { pageMetadata } from "@/lib/seo";
import { TownPage } from "@/components/TownPage";

interface Props {
  params: Promise<{ locale: Locale }>;
}

// German only — the business is in Germering; the page is not translated.
export function generateStaticParams() {
  return [{ locale: "de" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de") return {};
  return pageMetadata(locale, "/umzug-germering", getOrt("umzug-germering").meta);
}

export default async function UmzugGermeringPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "de") notFound();
  setRequestLocale(locale);

  const content = getOrt("umzug-germering");
  const pricing = getUmzug(locale).pricing;
  const rates = umzugRates(pricing);
  const answer = fillTemplate(content.answer, {
    base: formatBand(
      estimateUmzug(rates, {
        size: 1, zones: 0, material: false, fullPacking: false, furniture: false, kitchen: false,
      }),
    ),
    zone: formatBand(rates.zone),
  });

  return (
    <TownPage
      locale={locale}
      href="/umzug-germering"
      town="Germering"
      content={content}
      answer={answer}
      pricing={pricing}
      character={getCommon(locale).characters.umzug}
      service={{ label: "Umzug", href: "/umzug", serviceType: "Umzug" }}
      calculatorHref="/umzugskosten-rechner"
    />
  );
}
