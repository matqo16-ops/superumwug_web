"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { CallbackFormContent, Option } from "@/lib/content-types";

const inputClasses =
  "w-full rounded-lg border border-hairline bg-white px-4 py-2.5 text-ink placeholder:text-anthracite/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";

const labelClasses = "mb-1.5 block text-sm font-medium text-anthracite";

export interface B2bVariant {
  selectorLabel: string;
  selectorOptions: Option[];
  companyLabel: string;
  submit: string;
}

export function CallbackForm({
  form,
  initialTopic,
  b2b,
  idPrefix = "cb",
}: {
  form: CallbackFormContent;
  initialTopic?: string;
  /** When set, renders the B2B variant (partner-type selector + company field). */
  b2b?: B2bVariant;
  /** Keeps input ids unique when the form appears twice on a page (inline + modal). */
  idPrefix?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "rateLimited"
  >("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      preferredTime: data.get("preferredTime"),
      topic: data.get("topic") || undefined,
      message: data.get("message") || undefined,
      partnerType: data.get("partnerType") || undefined,
      companyName: data.get("companyName") || undefined,
      consent: data.get("consent") === "on",
      locale,
      sourcePage: pathname,
      // Honeypot — humans never see or fill this field.
      website: data.get("website") ?? "",
    };

    try {
      const response = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) setStatus("success");
      // 429 gets its own message: "check your details" is misleading when the
      // details were fine and the caller simply tried too often.
      else if (response.status === 429) setStatus("rateLimited");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 font-medium text-success"
      >
        {form.success}
      </p>
    );
  }

  const id = (field: string) => `${idPrefix}-${field}`;

  return (
    <form onSubmit={handleSubmit} noValidate={false}>
      {(status === "error" || status === "rateLimited") && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm font-medium text-error"
        >
          {status === "rateLimited" ? form.errorRateLimited : form.error}
        </p>
      )}

      <div className="space-y-4">
        {b2b && (
          <fieldset>
            <legend className={labelClasses}>{b2b.selectorLabel}</legend>
            <div className="flex gap-4">
              {b2b.selectorOptions.map((option, index) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="radio"
                    name="partnerType"
                    value={option.value}
                    defaultChecked={index === 0}
                    required
                    className="h-4 w-4 accent-gold-deep"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div>
          <label className={labelClasses} htmlFor={id("name")}>
            {form.labels.name} *
          </label>
          <input
            id={id("name")}
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor={id("phone")}>
            {form.labels.phone} *
          </label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor={id("preferredTime")}>
            {form.labels.preferredTime} *
          </label>
          <select
            id={id("preferredTime")}
            name="preferredTime"
            required
            className={inputClasses}
            defaultValue={form.timeOptions[0]?.value}
          >
            {form.timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses} htmlFor={id("topic")}>
            {form.labels.topic}
          </label>
          <select
            id={id("topic")}
            name="topic"
            className={inputClasses}
            defaultValue={initialTopic ?? ""}
          >
            <option value="">{form.topicPlaceholder}</option>
            {form.topicOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {b2b && (
          <div>
            <label className={labelClasses} htmlFor={id("companyName")}>
              {b2b.companyLabel}
            </label>
            <input
              id={id("companyName")}
              name="companyName"
              type="text"
              autoComplete="organization"
              className={inputClasses}
            />
          </div>
        )}

        <div>
          <label className={labelClasses} htmlFor={id("message")}>
            {form.labels.message}
          </label>
          <textarea
            id={id("message")}
            name="message"
            rows={3}
            className={inputClasses}
          />
        </div>

        {/* Honeypot field, visually hidden from humans but visible to naive bots. */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={id("website")}>Website</label>
          <input
            id={id("website")}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-anthracite">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold-deep"
          />
          <span>
            {form.consentPrefix}
            <Link
              href="/datenschutz"
              className="font-medium text-navy underline decoration-gold decoration-2 underline-offset-2 hover:text-gold-deep"
            >
              {form.consentLinkLabel}
            </Link>
            {form.consentSuffix}
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gold px-6 py-3 font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting"
            ? form.submitting
            : (b2b?.submit ?? form.submit)}
        </button>
      </div>
    </form>
  );
}
