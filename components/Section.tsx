import type { ReactNode } from "react";

const variants = {
  light: "bg-white text-ink",
  cream: "bg-cream text-ink",
  navy: "bg-navy text-white",
} as const;

export function Section({
  variant = "cream",
  id,
  children,
  className = "",
}: {
  variant?: keyof typeof variants;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`${variants[variant]} ${id ? "scroll-mt-4" : ""} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrowText,
  children,
  onDark = false,
  intro,
}: {
  eyebrowText?: string;
  children: ReactNode;
  onDark?: boolean;
  intro?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrowText && (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          {eyebrowText}
        </p>
      )}
      <h2
        className={`mt-2 font-display text-3xl font-semibold md:text-4xl ${
          onDark ? "text-white" : "text-navy"
        }`}
      >
        {children}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            onDark ? "text-white/75" : "text-anthracite/80"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
