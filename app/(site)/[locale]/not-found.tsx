import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { btnPrimary } from "@/lib/styles";

export default async function NotFound() {
  const locale = await getLocale();
  const isGerman = locale === "de";

  return (
    <div className="bg-cream">
      <div className="mx-auto flex max-w-3xl flex-col items-start px-6 py-24 md:py-32">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-navy">
          {isGerman ? "Seite nicht gefunden" : "Page not found"}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-anthracite/80">
          {isGerman
            ? "Die angeforderte Seite existiert nicht oder wurde verschoben."
            : "The page you requested does not exist or has been moved."}
        </p>
        <Link href="/" className={`${btnPrimary} mt-8`}>
          {isGerman ? "Zur Startseite" : "Back to home"}
        </Link>
      </div>
    </div>
  );
}
