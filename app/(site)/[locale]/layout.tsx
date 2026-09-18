import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Fraunces, Inter } from "next/font/google";
import { routing, type Locale } from "@/i18n/routing";
import { getCommon, getSiteData } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import { CallbackProvider } from "@/components/CallbackProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChatWidget } from "@/components/ChatWidget";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

// Only the locales below exist. Paths that skip the locale middleware (any
// asset extension, e.g. /llms-full.txt) were otherwise matched here with
// "llms-full.txt" as the locale, and pages read content/<locale>/*.json
// before the hasLocale check below could run — a 500 for every such probe.
// With dynamicParams off, an unknown locale is a 404 before anything renders.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const common = getCommon(locale as Locale);
  const site = getSiteData();

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider>
          <CallbackProvider form={common.callbackForm}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-navy"
            >
              {common.skipToContent}
            </a>
            <SiteHeader common={common} />
            <main id="main">{children}</main>
            <SiteFooter
              common={common}
              phone={site.organization.phone[locale as Locale]}
              site={site}
            />
            <ChatWidget strings={common.chatWidget} />
            {/* Cookieless, no personal data — needs no consent banner. */}
            <Analytics />
          </CallbackProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
