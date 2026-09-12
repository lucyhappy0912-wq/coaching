export type PhotoTone = "sage" | "paper" | "mist" | "dusk" | "forest";

export type MediaRef = {
  tone: PhotoTone;
  image: string;
  video: string;
};

export type HeroSlide = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  tone: PhotoTone;
  image: string;
  video: string;
};

export type CmsSite = {
  name: string;
  nameKo: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  addressLine: string;
  hours: string;
  lunch: string;
  owner: string;
  company: string;
  bizNo: string;
};

export type CmsCoach = {
  name: string;
  role: string;
  intro: string;
  credentials: string[];
  tone: PhotoTone;
  image: string;
};

export type CmsFaq = { q: string; a: string };

export type CmsWeek = MediaRef & {
  week: string;
  stage: string;
  title: string;
  body: string[];
  from: string;
  to: string;
};

export type CmsProgramPage = {
  eyebrow: string;
  title: string;
  lead: string;
  line: string;
  intro: string[];
  process: string[];
  hero: MediaRef;
  split: MediaRef;
  weeks: CmsWeek[];
  weeksIntro: string[];
  after: {
    title: string;
    lead: string;
    close: string;
    pairs: { before: string; after: string }[];
  };
};

export type CmsHomeProgram = MediaRef & {
  id: string;
  eyebrow: string;
  line: string;
  title: string;
  lead: string[];
  href: string;
  cta: string;
};

export type CmsPages = {
  home: {
    moment: MediaRef & { eyebrow: string; lines: string[]; body: string };
    programs: CmsHomeProgram[];
  };
  story: {
    slides: (MediaRef & { id: string; title: string; lines: string[] })[];
  };
  way: {
    hero: MediaRef & { eyebrow: string; title: string };
    items: (MediaRef & { no: string; title: string; body: string[] })[];
  };
  belief: {
    hero: MediaRef & { chain: string; line: string };
    items: (MediaRef & { no: string; en: string; title: string; body: string[] })[];
    close: string[];
  };
  stage: CmsProgramPage;
  nextChapter: CmsProgramPage;
  founder: CmsProgramPage;
  leadership: {
    hero: MediaRef & { eyebrow: string; line: string; meta: string };
    split: MediaRef;
    body: string[];
  };
  check: MediaRef & { eyebrow: string; title: string };
};

export type CmsData = {
  site: CmsSite;
  topMessages: string[];
  hero: HeroSlide[];
  coach: CmsCoach;
  faqs: CmsFaq[];
  pages: CmsPages;
};

export type CmsPost = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CmsMember = {
  id: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  source: string;
  createdAt: string;
};

export const PAGE_KEYS = [
  "home",
  "story",
  "way",
  "belief",
  "stage",
  "next-chapter",
  "founder",
  "leadership",
  "check",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];
