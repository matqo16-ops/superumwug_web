import type { StaticPathname } from "@/i18n/routing";

export interface PageMeta {
  title: string;
  description: string;
}

export interface Brand {
  id: "umzug" | "bayreno" | "entruempelung";
  name: string;
  tagline: string;
  /** The brand's service page — where the header and footer marks point. */
  href: StaticPathname;
  /**
   * A page about the brand itself, when one exists. Only the home-page card
   * uses it, because that card renders the brand name as its heading and so
   * becomes a link whose anchor text is the name — the signal that tells a
   * search engine what the page is *called*, not merely what it covers.
   */
  brandPage?: StaticPathname;
  logo: string;
  logoAlt: string;
}

/** Brand mascot photo used in page heroes. */
export interface CharacterImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface NavItem {
  label: string;
  href: StaticPathname;
  /** When set, the link targets a section anchor on `href` (e.g. the landing page). */
  hash?: string;
  /** Renders as an icon instead of text; `label` becomes the accessible name. */
  icon?: "home";
}

export interface Option {
  value: string;
  label: string;
}

export interface TitledItem {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CallbackFormContent {
  title: string;
  subtext: string;
  labels: {
    name: string;
    phone: string;
    preferredTime: string;
    topic: string;
    message: string;
  };
  timeOptions: Option[];
  topicPlaceholder: string;
  topicOptions: Option[];
  consentPrefix: string;
  consentLinkLabel: string;
  consentSuffix: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  /** Shown on HTTP 429 — distinct from a generic failure. */
  errorRateLimited: string;
  close: string;
}

export interface ChatWidgetContent {
  openLabel: string;
  closeLabel: string;
  title: string;
  subtitle: string;
  welcome: string;
  placeholder: string;
  send: string;
  typing: string;
  unavailable: string;
  error: string;
  callbackLink: string;
  gdprNote: string;
  gdprLinkLabel: string;
  voiceStart: string;
  voiceStop: string;
  voiceHint: string;
  voiceListening: string;
  voiceRequesting: string;
  micNotice: string;
  micDenied: string;
  voiceUnsupported: string;
  voiceError: string;
  speakOn: string;
  speakOff: string;
}

export interface CommonContent {
  meta: { siteName: string; localeName: string };
  skipToContent: string;
  /** Alt text for the character used site-wide in the footer. */
  characterAlt: string;
  /** Per-brand hero characters, keyed by brand id. */
  characters: Record<Brand["id"], CharacterImage>;
  /** Umbrella mmoving.de mark, split so it can be laid out horizontally. */
  siteLogo: {
    hexagon: string;
    hexagonWidth: number;
    hexagonHeight: number;
    wordmark: string;
    wordmarkWidth: number;
    wordmarkHeight: number;
    alt: string;
  };
  brands: Brand[];
  nav: NavItem[];
  header: {
    callbackButton: string;
    menuOpen: string;
    menuClose: string;
    navLabel: string;
    languageLabel: string;
  };
  chatCta: {
    eyebrow: string;
    headline: string;
    body: string;
    button: string;
    secondary: string;
  };
  footer: {
    brandLines: { id: Brand["id"]; text: string }[];
    serviceArea: string;
    phoneLabel: string;
    callbackLink: string;
    legalNavLabel: string;
    legalLinks: { label: string; href: StaticPathname }[];
    copyright: string;
  };
  callbackForm: CallbackFormContent;
  chatWidget: ChatWidgetContent;
  notFound: {
    code: string;
    title: string;
    body: string;
    homeLink: string;
  };
}

export interface Hero {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export interface HomeContent {
  meta: PageMeta;
  hero: Hero;
  badges: string[];
  brandsSection: {
    headline: string;
    cards: { brandId: Brand["id"]; body: string; cta: string }[];
  };
  packagesSection: {
    headline: string;
    intro: string;
    cards: { title: string; body: string }[];
    cta: string;
  };
  inspection: {
    eyebrow: string;
    headline: string;
    body: string;
    priceLabel: string;
    price: string;
    priceNote: string;
    includes: string[];
    orderCta: string;
    askCta: string;
  };
  b2bSection: {
    headline: string;
    body: string;
    cta: string;
    imageAlt: string;
  };
  faq: { headline: string; items: FaqItem[] };
  callbackSection: { headline: string; body: string };
}


/** SEO/AEO blocks shared by every service landing page. */
export interface ServiceSeoContent {
  /** Direct, quotable answer in the first one or two sentences. */
  lead: string;
  detail: { headline: string; sections: { heading: string; body: string }[] };
  pricing: {
    headline: string;
    intro: string;
    columns: string[];
    rows: string[][];
    extras: string[];
    note: string;
  };
  situations: { headline: string; items: TitledItem[] };
  areas: { headline: string; body: string; cities: string[] };
  crossLinks: {
    headline: string;
    items: { label: string; body: string; href: StaticPathname }[];
  };
  entity: {
    headline: string;
    body: string;
    facts: { label: string; value: string }[];
  };
}

export interface UmzugContent extends ServiceSeoContent {
  meta: PageMeta;
  hero: Hero;
  services: { headline: string; items: TitledItem[] };
  process: { headline: string; steps: TitledItem[] };
  guarantee: {
    badge: string;
    headline: string;
    lead: string;
    imageAlt: string;
    steps: TitledItem[];
    finePrint: string;
  };
  faq: { headline: string; items: FaqItem[] };
}

export interface RenovierungContent extends ServiceSeoContent {
  meta: PageMeta;
  hero: Hero;
  services: { headline: string; items: TitledItem[] };
  process: { headline: string; steps: TitledItem[] };
  combo: { headline: string; body: string; cta: string };
  faq: { headline: string; items: FaqItem[] };
}

export interface EntruempelungContent extends ServiceSeoContent {
  meta: PageMeta;
  hero: Hero;
  /**
   * Who trades under the name, stated on the service page itself.
   *
   * The other two brands each got their own page at their own name. This one
   * cannot: "Entrümpelung München" is simultaneously the brand and the head
   * commercial keyword, so a second page carrying it would compete with this
   * one for the query that matters most. The brand-identity content therefore
   * lives here, where it reinforces the page instead of splitting it.
   */
  brandIdentity: { heading: string; body: string };
  services: { headline: string; items: TitledItem[] };
  process: { headline: string; imageAlt: string; steps: TitledItem[] };
  faq: { headline: string; items: FaqItem[] };
}

export interface PackageItem {
  id: string;
  kicker: string;
  name: string;
  forWhom: string;
  included: TitledItem[];
  outcome: string;
}

export interface KomplettserviceContent {
  entity: ServiceSeoContent["entity"];
  lead: string;
  sequence: { headline: string; intro: string; steps: TitledItem[] };
  savings: {
    headline: string;
    intro: string;
    columns: string[];
    rows: string[][];
    note: string;
  };
  areas: ServiceSeoContent["areas"];
  crossLinks: ServiceSeoContent["crossLinks"];
  faq: { headline: string; items: FaqItem[] };
  meta: PageMeta;
  hero: Hero;
  labels: {
    forWhom: string;
    included: string;
    outcome: string;
    priceCtaLine: string;
    chatButton: string;
    callbackButton: string;
  };
  packages: PackageItem[];
  /** Standalone offer shown apart from the packages. */
  bonus: {
    eyebrow: string;
    badge: string;
    name: string;
    body: string;
    includes: string[];
    priceLabel: string;
    price: string;
    priceNote: string;
    orderCta: string;
    askCta: string;
  };
}

export interface ProjectItem {
  slug: string;
  name: string;
  brand: string;
  description: string;
  count: number;
}

export interface ProjectsContent {
  headline: string;
  intro: string;
  openLabel: string;
  closeLabel: string;
  beforeLabel: string;
  afterLabel: string;
  photosLabel: string;
  crew: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    /** Large card image; falls back to the first gallery image. */
    cover?: string;
    images: string[];
  };
  projects: ProjectItem[];
}

export interface B2bContent {
  meta: PageMeta;
  hero: Hero;
  referral: { headline: string; body: string; benefits: TitledItem[] };
  corporate: { headline: string; body: string; benefits: TitledItem[] };
  form: {
    headline: string;
    body: string;
    selectorLabel: string;
    selectorOptions: Option[];
    companyLabel: string;
    submit: string;
  };
  faq: { headline: string; items: FaqItem[] };
}

export interface KontaktContent {
  meta: PageMeta;
  hero: Hero;
  form: { headline: string; body: string };
  serviceArea: {
    headline: string;
    body: string;
    mapAlt: string;
    mapCaption: string;
    mapOpenLabel: string;
  };
  details: {
    headline: string;
    googleProfileLabel: string;
    items: { label: string; value: string }[];
  };
  faq: { headline: string; items: FaqItem[] };
}

export interface LegalContent {
  meta: PageMeta;
  title: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}

export interface BlogIndexContent {
  meta: PageMeta;
  headline: string;
  intro: string;
  breadcrumbLabel: string;
  homeLabel: string;
  blogLabel: string;
  readingTimeSuffix: string;
  publishedLabel: string;
  readMore: string;
  faqHeadline: string;
  relatedHeadline: string;
  backToBlog: string;
  moreArticles: string;
  faq: { headline: string; items: FaqItem[] };
}

export interface SiteData {
  siteUrl: string;
  organization: {
    name: string;
    legalName: string;
    /**
     * The trading name exactly as it appears on the Google Business Profile.
     * Structured data must state this verbatim, or Google cannot match the
     * profile to this site as one entity.
     */
    businessName: string;
    /** Every brand this one business trades under, for schema `brand`. */
    brands: string[];
    phone: string;
    email: string;
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressCountry: string;
  };
  /**
   * The physical location customers visit, as verified on the Google Business
   * Profile. Kept separate from `organization`, whose address is the legal
   * ladungsfähige Anschrift required in the Impressum — the two differ here.
   * Structured data must state this one so it matches the Business Profile.
   */
  businessLocation: {
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressCountry: string;
    latitude: number;
    longitude: number;
  };
  /**
   * The separate websites the individual brands still run. Emitted as schema
   * `sameAs`, which is how Google is told these sites and this one are one
   * business — otherwise they read as unrelated sites competing for the same
   * brand name, and the strongest one wins the brand query.
   */
  brandSites: string[];
  /** Canonical Google Business Profile URL — feeds schema sameAs and the map link. */
  googleBusinessProfile: string;
}

/**
 * A page for one brand, living at the brand's own URL.
 *
 * Its job is entity resolution rather than sales. "BayReno" is an invented
 * compound with almost no search volume, so a search engine with nothing to
 * match it against treats it as a misspelling of a far more common word and
 * offers that instead. The fix is a page where the brand name is the URL, the
 * <title> and the H1 at once, stating plainly what the name means and who
 * trades under it — the same signals that make any other brand resolvable.
 */
export interface BrandPageContent {
  meta: PageMeta;
  hero: Hero;
  /** One extractable sentence defining the brand and naming its operator. */
  lead: string;
  /** Spells the name out — "BayReno steht für Bayerische Renovierung". */
  nameExplainer: { heading: string; body: string };
  sections: { heading: string; body: string }[];
  services: {
    headline: string;
    intro: string;
    items: TitledItem[];
    cta: string;
  };
  facts: { headline: string; items: { label: string; value: string }[] };
  /** The other two brands, so the one-company relationship is on this page too. */
  siblings: {
    headline: string;
    body: string;
    items: { label: string; body: string; href: StaticPathname }[];
  };
  /** The brand's own separate website, declared rather than hidden. */
  externalSite: { headline: string; body: string; linkLabel: string };
  faq: { headline: string; items: FaqItem[] };
}

/** /ueber-uns — the one-entity/three-brands page. */
export interface UeberUnsContent {
  meta: PageMeta;
  hero: Hero;
  lead: string;
  sections: { heading: string; body: string }[];
  facts: { headline: string; items: { label: string; value: string }[] };
  faq: { headline: string; items: FaqItem[] };
}

/** /ratgeber/halteverbotszone-muenchen — standalone guide, German only. */
export interface HalteverbotszoneContent {
  meta: PageMeta;
  hero: Hero;
  /** Direct numeric answer rendered above everything — what LLMs extract. */
  answer: string;
  sections: { heading: string; body: string }[];
  faq: { headline: string; items: FaqItem[] };
  cta: { headline: string; body: string; primary: string; secondary: string };
}

/**
 * One Munich district landing page. Every prose field is required and the
 * build fails without it — a district page that could have been written about
 * any other district is a doorway page, which is worse than no page.
 */
export interface StadtteilContent {
  slug: string;
  name: string;
  bezirk?: string;
  intro: string;
  buildingStock: string;
  parking: string;
  access: string;
  typicalMove?: string;
  landmarks: string[];
  neighbours: string[];
  faq: FaqItem[];
  /**
   * A real completed job in this district. Owner-supplied only — never
   * invented. Rendered only when present.
   */
  reference?: {
    summary: string;
    volume?: string;
    duration?: string;
    price?: string;
  };
}
