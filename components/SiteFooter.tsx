import { Link } from "@/i18n/navigation";
import type { CommonContent } from "@/lib/content-types";
import { CallbackButton } from "./CallbackButton";

export function SiteFooter({
  common,
  phone,
}: {
  common: CommonContent;
  phone: string;
}) {
  return (
    <footer className="bg-navy-deep text-white/80">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          {common.brands.map((brand) => {
            const line = common.footer.brandLines.find(
              (entry) => entry.id === brand.id,
            );
            const inner = (
              <>
                <span className="font-display text-lg font-semibold text-white">
                  {brand.name}
                </span>
                <span className="mt-1 block text-sm text-white/60">
                  {line?.text}
                </span>
              </>
            );
            return brand.externalHref ? (
              <a
                key={brand.id}
                href={brand.externalHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-gold"
                aria-label={`${brand.name} — ${brand.externalNote ?? ""}`}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={brand.id}
                href={brand.href!}
                className="block hover:text-gold"
              >
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>{common.footer.serviceArea}</p>
          <p>
            {common.footer.phoneLabel}: <span className="text-white">{phone}</span>
          </p>
          <CallbackButton className="w-fit font-medium text-gold underline decoration-gold/50 underline-offset-4 hover:decoration-gold">
            {common.footer.callbackLink}
          </CallbackButton>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Legal" className="flex gap-6">
            {common.footer.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gold">
                {link.label}
              </Link>
            ))}
          </nav>
          <p>{common.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
