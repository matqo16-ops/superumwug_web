"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProjectsContent } from "@/lib/content-types";

/** Images of a project folder are 1.jpg … n.jpg; the crew folder lists its own. */
function projectImages(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/projects/${slug}/${i + 1}.jpg`);
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProjectsGallery({ content }: { content: ProjectsContent }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Close the embedded viewer with Escape.
  useEffect(() => {
    if (!openSlug) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenSlug(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openSlug]);

  // Bring the viewer into view when a project is opened.
  useEffect(() => {
    if (openSlug) {
      viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [openSlug]);

  const isCrewOpen = openSlug === "crew";
  const openProject = content.projects.find((p) => p.slug === openSlug);

  const openImages = isCrewOpen
    ? content.crew.images
    : openProject
      ? projectImages(openProject.slug, openProject.count)
      : [];
  const openTitle = isCrewOpen ? content.crew.title : (openProject?.name ?? "");
  const openDescription = isCrewOpen
    ? content.crew.description
    : (openProject?.description ?? "");

  return (
    <div>
      {/* Project folders */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-3">
        {content.projects.map((project) => {
          const images = projectImages(project.slug, project.count);
          const first = images[0];
          const last = images[images.length - 1];
          const isOpen = openSlug === project.slug;

          return (
            <button
              key={project.slug}
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : project.slug)}
              aria-expanded={isOpen}
              aria-label={`${project.name} — ${content.openLabel}`}
              className={`group relative block overflow-hidden rounded-xl border text-left shadow-card transition-colors ${
                isOpen
                  ? "border-gold ring-2 ring-gold/40"
                  : "border-hairline hover:border-gold"
              }`}
            >
              {/* Preview: first image | last image */}
              <div className="relative flex aspect-[4/3] w-full">
                <div className="relative w-1/2 overflow-hidden">
                  <Image
                    src={first}
                    alt={`${project.name} — ${content.beforeLabel}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 190px, (min-width: 640px) 45vw, 45vw"
                  />
                  <span className="absolute left-1.5 top-1.5 hidden rounded bg-navy-deep/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90 sm:block">
                    {content.beforeLabel}
                  </span>
                </div>
                {/* Gold seam between the two states */}
                <div className="w-px shrink-0 bg-gold/70" />
                <div className="relative w-1/2 overflow-hidden">
                  <Image
                    src={last}
                    alt={`${project.name} — ${content.afterLabel}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 190px, (min-width: 640px) 45vw, 45vw"
                  />
                  <span className="absolute right-1.5 top-1.5 hidden rounded bg-gold px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy sm:block">
                    {content.afterLabel}
                  </span>
                </div>

                {/* Name sits over the preview */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-transparent px-2.5 pb-2 pt-8 sm:px-4 sm:pb-3 sm:pt-10">
                  <p className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-gold sm:block">
                    {project.brand}
                  </p>
                  <h3 className="font-display text-[13px] font-semibold leading-tight text-white sm:text-lg">
                    {project.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-white/70 sm:text-xs">
                    {project.count} {content.photosLabel}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Highlighted crew folder — full width, at the bottom */}
      <div id="crew" className="mt-6 scroll-mt-24">
        <button
          type="button"
          onClick={() => setOpenSlug(isCrewOpen ? null : "crew")}
          aria-expanded={isCrewOpen}
          className={`group relative flex w-full flex-col overflow-hidden rounded-xl border-2 text-left shadow-card transition-colors sm:flex-row ${
            isCrewOpen
              ? "border-gold ring-2 ring-gold/40"
              : "border-gold/60 hover:border-gold"
          }`}
        >
          <div className="relative aspect-[2/1] w-full shrink-0 sm:aspect-auto sm:h-48 sm:w-2/5">
            <Image
              src={content.crew.cover ?? content.crew.images[0]}
              alt={content.crew.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(min-width: 640px) 40vw, 100vw"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center bg-navy px-5 py-5 sm:px-6 sm:py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              {content.crew.eyebrow}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
              {content.crew.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {content.crew.description}
            </p>
            <span className="mt-3 text-sm font-semibold text-gold">
              {content.crew.cta} →
            </span>
          </div>
        </button>
      </div>

      {/* Embedded viewer — all photos of the folder at once, inside the panel */}
      {openSlug && (
        <div
          ref={viewerRef}
          className="mt-6 scroll-mt-24 rounded-xl border border-hairline bg-white p-4 shadow-card sm:mt-8 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-navy sm:text-2xl">
                {openTitle}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-anthracite/80 sm:text-base">
                {openDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenSlug(null)}
              aria-label={content.closeLabel}
              className="shrink-0 rounded-md border border-hairline p-2 text-anthracite/70 transition-colors hover:border-gold hover:text-gold-deep"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
            {openImages.map((src, index) => (
              <figure key={src} className="overflow-hidden rounded-lg bg-cream">
                <Image
                  src={src}
                  alt={`${openTitle} — ${index + 1}/${openImages.length}`}
                  width={1600}
                  height={1200}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 640px) 45vw, 100vw"
                />
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
