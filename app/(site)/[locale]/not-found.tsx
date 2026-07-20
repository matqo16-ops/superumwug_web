import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCommon } from "@/lib/content";
import { btnPrimary } from "@/lib/styles";

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const { notFound } = getCommon(locale);

  return (
    <div className="bg-cream">
      <div className="mx-auto flex max-w-3xl flex-col items-start px-6 py-24 md:py-32">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep">
          {notFound.code}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-navy">
          {notFound.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-anthracite/80">
          {notFound.body}
        </p>
        <Link href="/" className={`${btnPrimary} mt-8`}>
          {notFound.homeLink}
        </Link>
      </div>
    </div>
  );
}
