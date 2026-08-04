import "server-only";
import fs from "fs";
import path from "path";
import type { Locale } from "@/i18n/routing";
import type {
  B2bContent,
  BayrenoContent,
  CommonContent,
  EntruempelungContent,
  HomeContent,
  KontaktContent,
  LegalContent,
  PaketeContent,
  ProjectsContent,
  SiteData,
  UmzugContent,
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
export const getBayreno = (locale: Locale) =>
  readJson<BayrenoContent>(locale, "bayreno.json");
export const getEntruempelung = (locale: Locale) =>
  readJson<EntruempelungContent>(locale, "entruempelung.json");
export const getPakete = (locale: Locale) =>
  readJson<PaketeContent>(locale, "pakete.json");
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

export function getKnowledgeBase(): string {
  return fs.readFileSync(
    path.join(contentDir, "chatbot-knowledge-base.md"),
    "utf8",
  );
}
