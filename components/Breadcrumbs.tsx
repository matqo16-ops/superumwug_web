import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { breadcrumbSchema, type Crumb } from "@/lib/schema";
import { JsonLd } from "./JsonLd";

export interface BreadcrumbLink {
  label: string;
  /** Omit on the current page — it renders as plain text. */
  href?: StaticPathname;
  /** Absolute URL for the JSON-LD node. */
  url: string;
}

/** Visible breadcrumb trail plus its matching BreadcrumbList JSON-LD. */
export function Breadcrumbs({
  items,
  label,
}: {
  items: BreadcrumbLink[];
  label: string;
}) {
  const crumbs: Crumb[] = items.map((item) => ({
    name: item.label,
    url: item.url,
  }));

  return (
    <nav aria-label={label} className="border-b border-hairline bg-cream">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-6 py-3 text-sm text-anthracite/70">
        {items.map((item, index) => (
          <li key={item.url} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-anthracite/40">
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="hover:text-gold-deep">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-navy">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
