import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getEntruempelung, getOrt } from "@/lib/content";
import { entruempelungRates, fillTemplate, formatBand } from "@/lib/estimate";
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
  return pageMetadata(locale, "/entruempelung-germering", getOrt("entruempelung-germering").meta);
}

export default async function EntruempelungGermeringPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "de") notFound();
  setRequestLocale(locale);

  const content = getOrt("entruempelung-germering");
  const pricing = getEntruempelung(locale).pricing;
  const rates = entruempelungRates(pricing);
  const twoRoom = rates.rows.find((r) => /2-Zimmer/.test(r.label));
  if (!twoRoom) throw new Error("Entrümpelung table has no 2-Zimmer row");
  const answer = fillTemplate(content.answer, {
    base: formatBand(twoRoom.band),
    cellar: formatBand(rates.rows[0].band),
  });

  return (
    <TownPage
      locale={locale}
      href="/entruempelung-germering"
      town="Germering"
      content={content}
      answer={answer}
      pricing={pricing}
      character={getCommon(locale).characters.entruempelung}
      service={{ label: "Entrümpelung", href: "/entruempelung", serviceType: "Entrümpelung und Haushaltsauflösung" }}
      calculatorHref="/entruempelung-kosten-rechner"
    />
  );
}
