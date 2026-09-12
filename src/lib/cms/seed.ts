import { COACH, FAQS, HERO_SLIDES, SITE, TOP_MESSAGES } from "@/lib/site";

import type { CmsData } from "./types";

export function cmsSeed(): CmsData {
  return {
    site: { ...SITE },
    topMessages: [...TOP_MESSAGES],
    hero: HERO_SLIDES.map((slide) => ({ ...slide, cta: { ...slide.cta } })),
    coach: { ...COACH, credentials: [...COACH.credentials] },
    faqs: FAQS.map((item) => ({ ...item })),
  };
}
