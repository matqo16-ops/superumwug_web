import type { AppPathname } from "@/i18n/routing";

export interface PageMeta {
  title: string;
  description: string;
}

export interface Brand {
  id: "umzug" | "bayreno" | "entruempelung";
  name: string;
  tagline: string;
  href: AppPathname;
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
  href: AppPathname;
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
    legalLinks: { label: string; href: AppPathname }[];
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
  b2bSection: { headline: string; body: string; cta: string };
  callbackSection: { headline: string; body: string };
}

export interface UmzugContent {
  meta: PageMeta;
  hero: Hero;
  services: { headline: string; items: TitledItem[] };
  guarantee: {
    badge: string;
    headline: string;
    lead: string;
    steps: TitledItem[];
    finePrint: string;
  };
  faq: { headline: string; items: FaqItem[] };
}

export interface BayrenoContent {
  meta: PageMeta;
  hero: Hero;
  services: { headline: string; items: TitledItem[] };
  process: { headline: string; steps: TitledItem[] };
  combo: { headline: string; body: string; cta: string };
  faq: { headline: string; items: FaqItem[] };
}

export interface EntruempelungContent {
  meta: PageMeta;
  hero: Hero;
  services: { headline: string; items: TitledItem[] };
  process: { headline: string; steps: TitledItem[] };
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

export interface PaketeContent {
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
}

export interface KontaktContent {
  meta: PageMeta;
  hero: Hero;
  form: { headline: string; body: string };
  serviceArea: { headline: string; body: string; mapAlt: string };
  details: { headline: string; items: { label: string; value: string }[] };
}

export interface LegalContent {
  meta: PageMeta;
  title: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}

export interface SiteData {
  siteUrl: string;
  organization: {
    name: string;
    legalName: string;
    phone: string;
    email: string;
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressCountry: string;
  };
  bayrenoUrl: string;
}
