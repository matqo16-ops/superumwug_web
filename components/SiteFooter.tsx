import Image from "next/image";
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
        {/* Company info + brand character */}
        <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <div className="grid gap-10 sm:grid-cols-3">
            {common.brands.map((brand) => {
              const line = common.footer.brandLines.find(
                (entry) => entry.id === brand.id,
              );
              return (
                <Link
                  key={brand.id}
                  href={brand.href}
                  className="block hover:text-gold"
                >
                  <span className="font-display text-lg font-semibold text-white">
                    {brand.name}
                  </span>
                  <span className="mt-1 block text-sm text-white/60">
                    {line?.text}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* On mobile the character moves into the contact panel below. */}
          <Image
            src={common.characters.bayreno.src}
            alt={common.characterAlt}
            width={common.characters.bayreno.width}
            height={common.characters.bayreno.height}
            className="hidden h-44 w-auto justify-self-end md:block"
            sizes="140px"
          />
        </div>

        {/* Service area · phone · callback — shares its panel with the character on mobile */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/15 pt-8">
          <div className="flex flex-1 flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>{common.footer.serviceArea}</p>
            <p>
              {common.footer.phoneLabel}:{" "}
              <span className="text-white">{phone}</span>
            </p>
            <CallbackButton className="w-fit font-medium text-gold underline decoration-gold/50 underline-offset-4 hover:decoration-gold">
              {common.footer.callbackLink}
            </CallbackButton>
          </div>
          <Image
            src="/images/header-char.png"
            alt={common.characterAlt}
            width={940}
            height={1592}
            className="block h-32 w-auto shrink-0 md:hidden"
            sizes="100px"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label={common.footer.legalNavLabel} className="flex gap-6">
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
