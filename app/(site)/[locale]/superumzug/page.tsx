import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getSuperumzug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { BrandPage } from "@/components/BrandPage";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/superumzug", getSuperumzug(locale).meta);
}

/**
 * /superumzug — the brand page for SuperUmzug.
 *
 * Separate from /umzug on purpose: this answers "what is SuperUmzug", /umzug
 * answers "what does a move in Munich cost". Different queries, so the two do
 * not compete. The brand also runs its own site at superumzug.de, declared
 * here and in schema sameAs so the two read as one business.
 */
export default async function SuperumzugPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <BrandPage
      content={getSuperumzug(locale)}
      locale={locale}
      brandId="umzug"
      brandName="SuperUmzug"
      href="/superumzug"
      serviceHref="/umzug"
      callbackTopic="umzug"
    />
  );
}
