/** Shared button/utility class strings so all CTAs look identical site-wide. */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold transition-colors";

export const btnPrimary = `${btnBase} bg-gold text-navy hover:bg-gold-deep hover:text-white`;

export const btnOutlineOnDark = `${btnBase} border-[1.5px] border-white/70 text-white hover:border-gold hover:text-gold`;

export const btnOutlineOnLight = `${btnBase} border-[1.5px] border-navy text-navy hover:border-gold-deep hover:text-gold-deep`;

export const eyebrow =
  "text-sm font-semibold uppercase tracking-[0.18em] text-gold";
