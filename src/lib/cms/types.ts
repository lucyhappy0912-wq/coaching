export type PhotoTone = "sage" | "paper" | "mist" | "dusk" | "forest";

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

export type CmsData = {
  site: CmsSite;
  topMessages: string[];
  hero: HeroSlide[];
  coach: CmsCoach;
  faqs: CmsFaq[];
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
