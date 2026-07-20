"use client";

import { useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import type { Brand, CommonContent } from "@/lib/content-types";
import { CallbackButton } from "./CallbackButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

const logoSizes: Record<Brand["id"], { width: number; height: number }> = {
  umzug: { width: 2031, height: 774 },
  entruempelung: { width: 2033, height: 774 },
  bayreno: { width: 2048, height: 512 },
};

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <path
        d="M4.5 2H10v5.5M10 2 2 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandBlock({ brand, priority }: { brand: Brand; priority?: boolean }) {
  const logo = (
    <Image
      src={brand.logo}
      alt={brand.logoAlt}
      width={logoSizes[brand.id].width}
      height={logoSizes[brand.id].height}
      priority={priority}
      className="h-8 w-auto"
      sizes="180px"
    />
  );
  const tagline = (
    <span className="mt-1.5 block text-xs leading-snug text-anthracite/70">
      {brand.tagline}
    </span>
  );

  if (brand.externalHref) {
    return (
      <a
        href={brand.externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-lg p-2 transition-colors hover:bg-cream"
        aria-label={`${brand.name} — ${brand.externalNote ?? ""}`}
      >
        <span className="flex items-center gap-1.5 text-anthracite/60 group-hover:text-gold-deep">
          {logo}
          <ExternalIcon />
        </span>
        {tagline}
      </a>
    );
  }
  return (
    <Link
      // Brand hrefs come from content JSON and match the pathnames config.
      href={brand.href!}
      className="block rounded-lg p-2 transition-colors hover:bg-cream"
    >
      {logo}
      {tagline}
    </Link>
  );
}

export function SiteHeader({ common }: { common: CommonContent }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-navy bg-white">
      {/* Brand row */}
      <div className="mx-auto hidden max-w-6xl items-stretch justify-between gap-4 px-6 py-4 md:flex">
        {common.brands.map((brand, index) => (
          <BrandBlock key={brand.id} brand={brand} priority={index === 0} />
        ))}
      </div>

      {/* Mobile brand row */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <Link href="/" className="block">
          <Image
            src={common.brands[0].logo}
            alt={common.brands[0].logoAlt}
            width={logoSizes.umzug.width}
            height={logoSizes.umzug.height}
            priority
            className="h-7 w-auto"
            sizes="150px"
          />
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? common.header.menuClose : common.header.menuOpen}
          className="rounded-md p-2 text-navy"
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
          <nav aria-label="Hauptnavigation" className="flex items-center">
            {common.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`border-b-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-gold text-gold"
                      : "border-transparent text-white/90 hover:border-gold/50 hover:text-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-5">
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
          <nav aria-label="Hauptnavigation" className="flex flex-col px-4 py-3">
            {common.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`rounded-md px-3 py-2.5 text-base font-medium ${
                  pathname === item.href
                    ? "text-gold"
                    : "text-white/90 hover:text-gold"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={common.brands[2].externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-white/90 hover:text-gold"
            >
              {common.brands[2].name} <ExternalIcon />
            </a>
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
