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

function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 8.5 10 3l7 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1V8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

  const homeItem = common.nav.find((item) => item.icon === "home");
  // On mobile the home icon lives in the brand row, so drop it from the menu list.
  const mobileNav = common.nav.filter((item) => item.icon !== "home");

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
        aria-label={item.icon ? item.label : undefined}
        title={item.icon ? item.label : undefined}
        className={className(isActive)}
      >
        {item.icon === "home" ? <HomeIcon /> : item.label}
      </Link>
    );
  };

  const desktopLinkClass = (active: boolean) =>
    `inline-flex items-center border-b-2 px-4 py-3.5 text-sm font-medium transition-colors ${
      active
        ? "border-gold text-gold"
        : "border-transparent text-white/90 hover:border-gold/50 hover:text-gold"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `inline-flex items-center rounded-md px-3 py-2.5 text-base font-medium ${
      active ? "text-gold" : "text-white/90 hover:text-gold"
    }`;

  return (
    <header className="border-b border-navy bg-white">
      {/* Brand row — mmoving.de umbrella mark, then the three brands */}
      <div className="mx-auto hidden max-w-6xl items-center gap-5 px-6 py-4 md:flex lg:gap-7">
        <Link
          href="/"
          aria-label={common.siteLogo.alt}
          className="flex shrink-0 items-center gap-2.5 rounded-lg p-1 transition-opacity hover:opacity-80"
        >
          <Image
            src={common.siteLogo.hexagon}
            alt=""
            aria-hidden="true"
            width={common.siteLogo.hexagonWidth}
            height={common.siteLogo.hexagonHeight}
            priority
            className="h-11 w-auto"
            sizes="44px"
          />
          <Image
            src={common.siteLogo.wordmark}
            alt=""
            aria-hidden="true"
            width={common.siteLogo.wordmarkWidth}
            height={common.siteLogo.wordmarkHeight}
            priority
            className="hidden h-4 w-auto lg:block"
            sizes="110px"
          />
        </Link>
        <span aria-hidden="true" className="h-10 w-px shrink-0 bg-hairline" />
        <div className="flex flex-1 items-stretch justify-between gap-4">
          {common.brands.map((brand, index) => (
            <BrandBlock key={brand.id} brand={brand} priority={index === 0} />
          ))}
        </div>
      </div>

      {/* Mobile brand row — all three brands, wrapping so they never overflow */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:hidden">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          {/* The mmoving mark doubles as the home link, left of the three brands */}
          <Link
            href="/"
            aria-label={common.siteLogo.alt}
            title={homeItem?.label}
            className="shrink-0"
          >
            <Image
              src={common.siteLogo.hexagon}
              alt=""
              aria-hidden="true"
              width={common.siteLogo.hexagonWidth}
              height={common.siteLogo.hexagonHeight}
              priority
              className="h-7 w-auto"
              sizes="28px"
            />
          </Link>
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
            {mobileNav.map((item) => renderNavLink(item, mobileLinkClass))}
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
