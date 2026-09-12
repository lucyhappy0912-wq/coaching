import type { CmsPages, PageKey } from "./types";

export const PAGE_META: { slug: PageKey; href: string; title: string; preview: string }[] = [
  { slug: "home", href: "/", title: "홈", preview: "/" },
  { slug: "story", href: "/story", title: "왜멈춘자인가", preview: "/story" },
  { slug: "way", href: "/way", title: "멈춘자가 만든 전환", preview: "/way" },
  { slug: "belief", href: "/belief", title: "Our Belief", preview: "/belief" },
  { slug: "stage", href: "/coaching/stage", title: "Stage Transition", preview: "/coaching/stage" },
  { slug: "next-chapter", href: "/coaching/next-chapter", title: "Next Chapter", preview: "/coaching/next-chapter" },
  { slug: "founder", href: "/coaching/founder", title: "Founder Transition", preview: "/coaching/founder" },
  { slug: "leadership", href: "/coaching/leadership", title: "Your Next Leadership", preview: "/coaching/leadership" },
  { slug: "check", href: "/check", title: "진단", preview: "/check" },
];

export function pageSlice(pages: CmsPages, slug: PageKey) {
  switch (slug) {
    case "home":
      return pages.home;
    case "story":
      return pages.story;
    case "way":
      return pages.way;
    case "belief":
      return pages.belief;
    case "stage":
      return pages.stage;
    case "next-chapter":
      return pages.nextChapter;
    case "founder":
      return pages.founder;
    case "leadership":
      return pages.leadership;
    case "check":
      return pages.check;
  }
}

export function applyPageSlice(pages: CmsPages, slug: PageKey, slice: unknown): CmsPages {
  const next = structuredClone(pages);
  switch (slug) {
    case "home":
      next.home = slice as CmsPages["home"];
      break;
    case "story":
      next.story = slice as CmsPages["story"];
      break;
    case "way":
      next.way = slice as CmsPages["way"];
      break;
    case "belief":
      next.belief = slice as CmsPages["belief"];
      break;
    case "stage":
      next.stage = slice as CmsPages["stage"];
      break;
    case "next-chapter":
      next.nextChapter = slice as CmsPages["nextChapter"];
      break;
    case "founder":
      next.founder = slice as CmsPages["founder"];
      break;
    case "leadership":
      next.leadership = slice as CmsPages["leadership"];
      break;
    case "check":
      next.check = slice as CmsPages["check"];
      break;
  }
  return next;
}
