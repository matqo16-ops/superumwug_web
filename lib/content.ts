import "server-only";
import fs from "fs";
import path from "path";
import type { Locale } from "@/i18n/routing";
import type {
  B2bContent,
  BlogIndexContent,
  BrandPageContent,
  KomplettserviceContent,
  CommonContent,
  EntruempelungContent,
  HomeContent,
  KontaktContent,
  LegalContent,
  RenovierungContent,
  ProjectsContent,
  SiteData,
  UmzugContent,
  UeberUnsContent,
  HalteverbotszoneContent,
  StadtteilContent,
} from "./content-types";

const contentDir = path.join(process.cwd(), "content");
const cache = new Map<string, unknown>();

function readJson<T>(...segments: string[]): T {
  const file = path.join(contentDir, ...segments);
  const cached = cache.get(file);
  if (cached) return cached as T;
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as T;
  cache.set(file, parsed);
  return parsed;
}

export const getSiteData = () => readJson<SiteData>("site.json");

export const getCommon = (locale: Locale) =>
  readJson<CommonContent>(locale, "common.json");
export const getHome = (locale: Locale) =>
  readJson<HomeContent>(locale, "home.json");
export const getUmzug = (locale: Locale) =>
  readJson<UmzugContent>(locale, "umzug.json");
export const getRenovierung = (locale: Locale) =>
  readJson<RenovierungContent>(locale, "renovierung.json");
export const getEntruempelung = (locale: Locale) =>
  readJson<EntruempelungContent>(locale, "entruempelung.json");
export const getKomplettservice = (locale: Locale) =>
  readJson<KomplettserviceContent>(locale, "komplettservice.json");
export const getProjects = (locale: Locale) =>
  readJson<ProjectsContent>(locale, "projekte.json");
export const getB2b = (locale: Locale) =>
  readJson<B2bContent>(locale, "b2b.json");
export const getKontakt = (locale: Locale) =>
  readJson<KontaktContent>(locale, "kontakt.json");
export const getImpressum = (locale: Locale) =>
  readJson<LegalContent>(locale, "impressum.json");
export const getDatenschutz = (locale: Locale) =>
  readJson<LegalContent>(locale, "datenschutz.json");
export const getAgb = (locale: Locale) =>
  readJson<LegalContent>(locale, "agb.json");

export const getBlogIndexContent = () =>
  readJson<BlogIndexContent>("de", "blog.json");

export function getKnowledgeBase(): string {
  return fs.readFileSync(
    path.join(contentDir, "chatbot-knowledge-base.md"),
    "utf8",
  );
}

export const getUeberUns = (locale: Locale) =>
  readJson<UeberUnsContent>(locale, "ueber-uns.json");

/**
 * Brand pages — one per trading name, so a search for the bare name has
 * something to match. Entrümpelung München deliberately has none: that name is
 * also the head commercial keyword, so a second page carrying it would compete
 * with /entruempelung instead of supporting it.
 */
export const getBayreno = (locale: Locale) =>
  readJson<BrandPageContent>(locale, "bayreno.json");
export const getSuperumzug = (locale: Locale) =>
  readJson<BrandPageContent>(locale, "superumzug.json");

/** German only — the guide is not translated. */
export const getHalteverbotszone = () =>
  readJson<HalteverbotszoneContent>("de", "halteverbotszone.json");

/** Munich district pages — German only. */
export function getStadtteilSlugs(): string[] {
  const dir = path.join(contentDir, "de", "stadtteile");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export const getStadtteil = (slug: string) =>
  readJson<StadtteilContent>("de", "stadtteile", `${slug}.json`);
