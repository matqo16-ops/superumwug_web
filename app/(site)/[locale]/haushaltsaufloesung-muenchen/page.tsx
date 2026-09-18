import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getLeistung } from "@/lib/leistungen";
import { pageMetadata } from "@/lib/seo";
import { LeistungPage } from "@/components/LeistungPage";

interface Props {
  params: Promise<{ locale: Locale }>;
}

// German only — the guide is not translated.
export function generateStaticParams() {
  return [{ locale: "de" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de") return {};
  const page = getLeistung("haushaltsaufloesung-muenchen");
  return pageMetadata(locale, "/haushaltsaufloesung-muenchen", {
    title: page.metaTitle,
    description: page.description,
  });
}

export default async function HaushaltsaufloesungPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "de") notFound();
  setRequestLocale(locale);
  return (
    <LeistungPage
      locale={locale}
      href="/haushaltsaufloesung-muenchen"
      page={getLeistung("haushaltsaufloesung-muenchen")}
    />
  );
}
