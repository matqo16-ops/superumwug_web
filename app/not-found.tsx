import { getCommon } from "@/lib/content";
import "@/app/globals.css";

// The 404 for requests that never pass the locale middleware: paths ending in
// an asset extension (.txt, .xml, .ico, ...) are excluded from it, so the
// localized not-found page, which calls getLocale(), had no locale and threw.
// /llms-full.txt, /favicon.ico and /BingSiteAuth.xml all answered 500 — the
// very paths crawlers and AI fetchers probe. This page reads no request
// state, so it cannot throw, and answers a plain German 404.
export default function RootNotFound() {
  const { notFound } = getCommon("de");
  return (
    <html lang="de">
      <body className="bg-cream">
        <main className="mx-auto flex max-w-3xl flex-col items-start px-6 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep">
            {notFound.code}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-navy">{notFound.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-anthracite/80">{notFound.body}</p>
          <a
            href="/"
            className="mt-8 rounded-lg bg-gold px-6 py-3 font-semibold text-navy"
          >
            {notFound.homeLink}
          </a>
        </main>
      </body>
    </html>
  );
}
