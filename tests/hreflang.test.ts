import fs from "fs";
import path from "path";
import { describe, expect, it, vi } from "vitest";
import {
  GERMAN_ONLY_ROUTES,
  isGermanOnly,
  routing,
  type AppPathname,
  type StaticPathname,
} from "@/i18n/routing";

// i18n/navigation pulls in next-intl's client navigation, which needs the Next
// runtime and does not resolve here. getPathname is reimplemented against the
// same routing config so the URLs asserted below are the ones production
// builds: German is served unprefixed, every other locale gets a prefix, and
// the slug comes from the pathnames map.
vi.mock("@/i18n/navigation", () => ({
  getPathname: ({ locale, href }: { locale: string; href: string }) => {
    const entry = (routing.pathnames as Record<string, unknown>)[href];
    const path =
      typeof entry === "string"
        ? entry
        : (entry as Record<string, string>)[locale];
    if (locale === routing.defaultLocale) return path;
    return path === "/" ? `/${locale}` : `/${locale}${path}`;
  },
}));

const { pageMetadata } = await import("@/lib/seo");

/**
 * hreflang must only ever name URLs that resolve.
 *
 * This has broken twice. The first time, the language switcher linked to a
 * non-existent English version of every district and blog page. The second
 * time, /blog and /ratgeber/halteverbotszone-muenchen advertised
 * hreflang="en" at URLs that 404, which Search Console duly reported. One
 * dead alternate can invalidate the hreflang set for the whole page, so this
 * is worth a test rather than a comment.
 */

const meta = { title: "t", description: "d" };

const staticPathnames = (Object.keys(routing.pathnames) as AppPathname[]).filter(
  (href): href is StaticPathname => !href.includes("["),
);

describe("hreflang alternates", () => {
  it("omits alternates entirely on German-only routes", () => {
    const germanOnlyStatic = staticPathnames.filter(isGermanOnly);
    // Guard against the test silently passing because the filter matched
    // nothing — if the route names ever change, this fails loudly.
    expect(germanOnlyStatic.length).toBeGreaterThan(0);

    for (const href of germanOnlyStatic) {
      const languages = pageMetadata("de", href, meta).alternates?.languages;
      expect(
        languages,
        `${href} is German-only and must not advertise an English alternate`,
      ).toBeUndefined();
    }
  });

  it("emits both locales plus x-default on bilingual routes", () => {
    const bilingual = staticPathnames.filter((href) => !isGermanOnly(href));
    expect(bilingual.length).toBeGreaterThan(0);

    for (const href of bilingual) {
      const languages = pageMetadata("de", href, meta).alternates?.languages;
      expect(languages, `${href} should have hreflang alternates`).toBeDefined();
      for (const locale of routing.locales) {
        expect(languages?.[locale], `${href} missing hreflang ${locale}`).toBeTruthy();
      }
      expect(languages?.["x-default"], `${href} missing x-default`).toBeTruthy();
    }
  });

  it("never points an alternate at a locale-prefixed German URL", () => {
    // German is served unprefixed. A "/de/..." alternate would be a redirect
    // at best, which is not what hreflang is for.
    for (const href of staticPathnames) {
      const languages = pageMetadata("de", href, meta).alternates?.languages;
      for (const url of Object.values(languages ?? {})) {
        expect(String(url), `${href} emitted a /de/-prefixed alternate`).not.toMatch(
          /\/de(\/|$)/,
        );
      }
    }
  });

  it("keeps every German-only route inside the declared pathname map", () => {
    // Catches a typo in GERMAN_ONLY_ROUTES that would silently disable the
    // protection for the route it was meant to cover.
    const known = new Set(Object.keys(routing.pathnames));
    for (const href of GERMAN_ONLY_ROUTES) {
      expect(known.has(href), `${href} is not a declared route`).toBe(true);
    }
  });

  it("lists every route whose page refuses non-German locales", () => {
    // The check that actually matters. Filtering by GERMAN_ONLY_ROUTES alone
    // is circular: drop a route from the list and the other tests simply stop
    // looking at it, which is exactly the regression that shipped. So derive
    // the truth from the route files instead — a German-only page always
    // guards its component with `locale !== "de"` — and assert the list
    // agrees. Forgetting to register a new German-only route now fails here.
    const root = path.join(process.cwd(), "app", "(site)", "[locale]");

    const pages: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name === "page.tsx") pages.push(full);
      }
    };
    walk(root);
    expect(pages.length).toBeGreaterThan(0);

    const guarded = pages
      .filter((file) => /locale\s*!==\s*"de"/.test(fs.readFileSync(file, "utf8")))
      .map((file) => {
        const route = path
          .relative(root, file)
          .replace(/\\/g, "/")
          .replace(/\/?page\.tsx$/, "");
        return `/${route}`;
      });

    expect(guarded.length).toBeGreaterThan(0);
    for (const href of guarded) {
      expect(
        isGermanOnly(href),
        `${href} rejects non-German locales but is missing from GERMAN_ONLY_ROUTES, so it will advertise an English alternate that 404s`,
      ).toBe(true);
    }
  });
});
