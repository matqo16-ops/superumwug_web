import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAgb, getCommon } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ChatCta } from "@/components/ChatCta";
import { LegalPage } from "@/components/LegalPage";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/agb", getAgb(locale).meta);
}

/**
 * /agb — one set of terms for all three brands, because all three are the same
 * legal entity. The parts are split by trade rather than by brand: a move is a
 * Frachtvertrag under the HGB and a renovation is a Werkvertrag under the BGB,
 * and those two regimes differ on the points that matter most — cancellation
 * and liability — so one undifferentiated text would be wrong for both.
 */
export default async function AgbPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const common = getCommon(locale);

  return (
    <>
      <LegalPage content={getAgb(locale)} />
      <ChatCta content={common.chatCta} />
    </>
  );
}
