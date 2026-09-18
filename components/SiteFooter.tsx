import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { CommonContent, SiteData } from "@/lib/content-types";
import { getStadtteil, getStadtteilSlugs } from "@/lib/content";
import { CallbackButton } from "./CallbackButton";

/** "+49 176 6415 1890" → "tel:+4917664151890" */
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export function SiteFooter({
  common,
  phone,
  site,
}: {
  common: CommonContent;
  phone: string;
  site: SiteData;
}) {
  const location = site.businessLocation;
  const districts = common.footer.columns.some((c) => c.districts)
    ? getStadtteilSlugs().map((slug) => getStadtteil(slug))
    : [];

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

        {/* Link columns + contact. Plain <a>: hrefs are final localized
            paths from the content file, including German-only pages. */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 text-sm lg:grid-cols-5">
          {common.footer.columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="font-semibold text-white">{column.heading}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href} className="hover:text-gold">
                      {link.label}
                    </a>
                  </li>
                ))}
                {column.districts &&
                  districts.map((d) => (
                    <li key={d.slug}>
                      <a href={`/umzug/${d.slug}`} className="hover:text-gold">
                        Umzug {d.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-2 lg:col-span-1">
            <p className="font-semibold text-white">{common.footer.contact.heading}</p>
            <address className="mt-3 space-y-2 not-italic">
              <span className="block">{common.footer.contact.name}</span>
              <span className="block">
                {location.streetAddress}, {location.postalCode}{" "}
                {location.addressLocality}
              </span>
              <a href={telHref(phone)} className="block text-white hover:text-gold">
                {common.footer.phoneLabel}: {phone}
              </a>
              <a
                href={`mailto:${site.organization.email}`}
                className="block hover:text-gold"
              >
                {common.footer.contact.emailLabel}: {site.organization.email}
              </a>
              <span className="block">{common.footer.contact.hours}</span>
            </address>
          </div>
        </div>

        {/* Service area · phone · callback — shares its panel with the character on mobile */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/15 pt-8">
          <div className="flex flex-1 flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>{common.footer.serviceArea}</p>
            <p>
              {common.footer.phoneLabel}:{" "}
              <a href={telHref(phone)} className="text-white hover:text-gold">
                {phone}
              </a>
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
