import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getBayreno } from "@/lib/content";
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
  return pageMetadata(locale, "/bayreno", getBayreno(locale).meta);
}

/**
 * /bayreno — the brand page for BayReno.
 *
 * A search for the bare name used to return a spelling correction to an
 * unrelated global brand, because nothing used "BayReno" as a name anywhere
 * that carries weight. This URL used to 301 to /renovierung, throwing away the
 * one address that spells it. The redirect is gone; the two pages answer
 * different questions and link to each other.
 */
export default async function BayrenoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <BrandPage
      content={getBayreno(locale)}
      locale={locale}
      brandId="bayreno"
      brandName="BayReno"
      href="/bayreno"
      serviceHref="/renovierung"
      callbackTopic="renovierung"
    />
  );
}
