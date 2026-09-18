"use client";

import { useState } from "react";
import type {
  EntruempelungRechnerContent,
  UmzugRechnerContent,
} from "@/lib/content-types";
import {
  estimateEntruempelung,
  estimateUmzug,
  formatBand,
  type Band,
  type EntruempelungRates,
  type UmzugRates,
} from "@/lib/estimate";
import { btnPrimary } from "@/lib/styles";
import { CallbackButton } from "./CallbackButton";

// The result is on screen from the first render, computed from sensible
// defaults — no field has to be filled before a number appears. The same
// figures are in the server-rendered table below, which is what crawlers and
// assistants read; this component only makes them explorable.

const fieldLabel = "block text-sm font-semibold text-navy";
const selectClass =
  "mt-2 w-full rounded-lg border border-hairline bg-white px-3 py-2.5 text-base text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1.5 text-base text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-gold-deep"
      />
      <span>{label}</span>
    </label>
  );
}

function Result({
  band,
  label,
  note,
  extra,
  cta,
}: {
  band: Band;
  label: string;
  note: string;
  extra?: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-navy-deep p-6 text-white md:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          {label}
        </p>
        {/* Announced to screen readers as the figure changes. */}
        <p
          aria-live="polite"
          className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl"
        >
          {formatBand(band)}
        </p>
        <p className="mt-2 text-white/70">{note}</p>
        {extra && <p className="mt-4 text-sm text-white/70">{extra}</p>}
      </div>
      <CallbackButton className={`${btnPrimary} mt-8 w-full sm:w-fit`}>
        {cta}
      </CallbackButton>
    </div>
  );
}

export function UmzugCalculator({
  rates,
  content,
}: {
  rates: UmzugRates;
  content: UmzugRechnerContent["calculator"];
}) {
  // Defaults: the most common Munich case, a 2-room flat with a zone at both ends.
  const [size, setSize] = useState(1);
  const [zones, setZones] = useState(2);
  const [material, setMaterial] = useState(false);
  const [fullPacking, setFullPacking] = useState(false);
  const [furniture, setFurniture] = useState(false);
  const [kitchen, setKitchen] = useState(false);

  const band = estimateUmzug(rates, {
    size,
    zones,
    material,
    fullPacking,
    furniture,
    kitchen,
  });

  return (
    <div className="grid gap-6 rounded-2xl border border-hairline bg-white p-5 shadow-card md:grid-cols-[1.2fr_1fr] md:p-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="rechner-groesse" className={fieldLabel}>
            {content.sizeLabel}
          </label>
          <select
            id="rechner-groesse"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className={selectClass}
          >
            {rates.rows.map((row, index) => (
              <option key={row.label} value={index}>
                {row.label} ({row.detail})
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className={fieldLabel}>{content.zonesLabel}</legend>
          <p className="mt-1 text-sm text-anthracite/75">{content.zonesHelp}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {content.zoneOptions.map((option, index) => (
              <label
                key={option}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium ${
                  zones === index
                    ? "border-gold bg-gold/15 text-navy"
                    : "border-hairline text-anthracite hover:border-gold/60"
                }`}
              >
                <input
                  type="radio"
                  name="rechner-zonen"
                  value={index}
                  checked={zones === index}
                  onChange={() => setZones(index)}
                  className="sr-only"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={fieldLabel}>{content.extrasLabel}</legend>
          <div className="mt-1">
            <Checkbox label={content.options.material} checked={material} onChange={setMaterial} />
            <Checkbox label={content.options.fullPacking} checked={fullPacking} onChange={setFullPacking} />
            <Checkbox label={content.options.furniture} checked={furniture} onChange={setFurniture} />
            <Checkbox label={content.options.kitchen} checked={kitchen} onChange={setKitchen} />
          </div>
        </fieldset>
      </div>

      <Result
        band={band}
        label={content.resultLabel}
        note={content.resultNote}
        cta={content.resultCta}
      />
    </div>
  );
}

export function EntruempelungCalculator({
  rates,
  content,
}: {
  rates: EntruempelungRates;
  content: EntruempelungRechnerContent["calculator"];
}) {
  // Defaults: a 2-room flat (row 3) on the ground floor or with a lift.
  const [object, setObject] = useState(Math.min(3, rates.rows.length - 1));
  const [floors, setFloors] = useState(0);
  const [hazardous, setHazardous] = useState(false);
  const [zone, setZone] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleaningM2, setCleaningM2] = useState(60);

  const band = estimateEntruempelung(rates, {
    object,
    floors,
    hazardous,
    zone,
    cleaningM2: cleaning ? Math.max(0, cleaningM2) : 0,
  });

  return (
    <div className="grid gap-6 rounded-2xl border border-hairline bg-white p-5 shadow-card md:grid-cols-[1.2fr_1fr] md:p-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="rechner-objekt" className={fieldLabel}>
            {content.objectLabel}
          </label>
          <select
            id="rechner-objekt"
            value={object}
            onChange={(e) => setObject(Number(e.target.value))}
            className={selectClass}
          >
            {rates.rows.map((row, index) => (
              <option key={row.label} value={index}>
                {row.label} ({row.detail})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rechner-etagen" className={fieldLabel}>
            {content.floorsLabel}
          </label>
          <p className="mt-1 text-sm text-anthracite/75">{content.floorsHelp}</p>
          <select
            id="rechner-etagen"
            value={floors}
            onChange={(e) => setFloors(Number(e.target.value))}
            className={selectClass}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Checkbox label={content.options.hazardous} checked={hazardous} onChange={setHazardous} />
          <Checkbox label={content.options.zone} checked={zone} onChange={setZone} />
          <Checkbox label={content.options.cleaning} checked={cleaning} onChange={setCleaning} />
          {cleaning && (
            <div className="mt-2 pl-7">
              <label htmlFor="rechner-reinigung" className="block text-sm text-anthracite/85">
                {content.cleaningLabel}
              </label>
              <input
                id="rechner-reinigung"
                type="number"
                inputMode="numeric"
                min={1}
                max={1000}
                value={cleaningM2}
                onChange={(e) => setCleaningM2(Number(e.target.value))}
                className={`${selectClass} max-w-[10rem]`}
              />
            </div>
          )}
        </div>
      </div>

      <Result
        band={band}
        label={content.resultLabel}
        note={content.resultNote}
        extra={hazardous ? content.resultOpenEnd : undefined}
        cta={content.resultCta}
      />
    </div>
  );
}
