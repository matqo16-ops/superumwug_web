"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Brand, CommonContent, NavItem } from "@/lib/content-types";
import { CallbackButton } from "./CallbackButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

const logoSizes: Record<Brand["id"], { width: number; height: number }> = {
  umzug: { width: 2031, height: 774 },
  bayreno: { width: 2048, height: 512 },
  entruempelung: { width: 2033, height: 774 },
};

function BrandBlock({ brand, priority }: { brand: Brand; priority?: boolean }) {
  return (
    <Link
      href={brand.href}
      className="block rounded-lg p-2 transition-colors hover:bg-cream"
    >
      <Image
        src={brand.logo}
        alt={brand.logoAlt}
        width={logoSizes[brand.id].width}
        height={logoSizes[brand.id].height}
        priority={priority}
        className="h-8 w-auto"
        sizes="180px"
      />
      <span className="mt-1.5 block text-xs leading-snug text-anthracite/70">
        {brand.tagline}
      </span>
    </Link>
  );
}

export function SiteHeader({ common }: { common: CommonContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  /**
   * Anchor nav items (Projekte, Crew) point at a section on another page, so
   * they render as a plain <a> with the localized path + hash.
   */
  const renderNavLink = (item: NavItem, className: (active: boolean) => string) => {
    if (item.hash) {
      return (
        <a
          key={`${item.href}#${item.hash}`}
          href={`${getPathname({ locale, href: item.href })}#${item.hash}`}
          onClick={() => setMenuOpen(false)}
          className={className(false)}
        >
          {item.label}
        </a>
      );
    }
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMenuOpen(false)}
        aria-current={isActive ? "page" : undefined}
        className={className(isActive)}
      >
        {item.label}
      </Link>
    );
  };

  const desktopLinkClass = (active: boolean) =>
    `border-b-2 px-3 py-3.5 text-sm font-medium transition-colors ${
      active
        ? "border-gold text-gold"
        : "border-transparent text-white/90 hover:border-gold/50 hover:text-gold"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `rounded-md px-3 py-2.5 text-base font-medium ${
      active ? "text-gold" : "text-white/90 hover:text-gold"
    }`;

  return (
    <header className="border-b border-navy bg-white">
      {/* Brand row — Super Umzug · BayReno · Super Entrümpelung */}
      <div className="mx-auto hidden max-w-6xl items-stretch justify-between gap-4 px-6 py-4 md:flex">
        {common.brands.map((brand, index) => (
          <BrandBlock key={brand.id} brand={brand} priority={index === 0} />
        ))}
      </div>

      {/* Mobile brand row — all three brands, wrapping so they never overflow */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:hidden">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {common.brands.map((brand, index) => (
            <Link key={brand.id} href={brand.href} className="block">
              <Image
                src={brand.logo}
                alt={brand.logoAlt}
                width={logoSizes[brand.id].width}
                height={logoSizes[brand.id].height}
                priority={index === 0}
                className="h-6 w-auto"
                sizes="100px"
              />
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? common.header.menuClose : common.header.menuOpen}
          className="shrink-0 rounded-md p-2 text-navy"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Nav row (desktop) */}
      <div className="hidden bg-navy md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6">
          <nav aria-label={common.header.navLabel} className="flex items-center">
            {common.nav.map((item) => renderNavLink(item, desktopLinkClass))}
          </nav>
          <div className="flex shrink-0 items-center gap-5">
            <LanguageSwitcher label={common.header.languageLabel} />
            <CallbackButton className="my-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white">
              {common.header.callbackButton}
            </CallbackButton>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="bg-navy md:hidden">
          <nav aria-label={common.header.navLabel} className="flex flex-col px-4 py-3">
            {common.nav.map((item) => renderNavLink(item, mobileLinkClass))}
            <div className="mt-3 flex items-center justify-between border-t border-white/15 px-3 pt-4 pb-2">
              <LanguageSwitcher label={common.header.languageLabel} />
              <CallbackButton className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy">
                {common.header.callbackButton}
              </CallbackButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
