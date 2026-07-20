import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getDatenschutz } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ChatCta } from "@/components/ChatCta";
import { LegalPage } from "@/components/LegalPage";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/datenschutz", getDatenschutz(locale).meta);
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const common = getCommon(locale);

  return (
    <>
      <LegalPage content={getDatenschutz(locale)} />
      <ChatCta content={common.chatCta} />
    </>
  );
}
