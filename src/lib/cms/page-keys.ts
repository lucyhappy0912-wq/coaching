import type { CmsPages, PageKey } from "./types";

export const PAGE_META: {
  slug: PageKey;
  href: string;
  title: string;
  subtitle: string;
  group: string;
  preview: string;
}[] = [
  { slug: "home", href: "/", title: "홈", subtitle: "방문자가 처음 보는 화면", group: "첫 화면", preview: "/" },
  { slug: "story", href: "/story", title: "왜멈춘자인가", subtitle: "브랜드가 시작된 이유", group: "브랜드", preview: "/story" },
  { slug: "way", href: "/way", title: "멈춘자가 만든 전환", subtitle: "전환을 만드는 네 가지 방식", group: "브랜드", preview: "/way" },
  { slug: "belief", href: "/belief", title: "Our Belief", subtitle: "우리가 믿는 것", group: "브랜드", preview: "/belief" },
  { slug: "stage", href: "/coaching/stage", title: "Stage Transition", subtitle: "다음 무대를 고르는 6주 코칭", group: "코칭 프로그램", preview: "/coaching/stage" },
  { slug: "next-chapter", href: "/coaching/next-chapter", title: "Next Chapter", subtitle: "시니어, 다음 삶을 설계하는 6주", group: "코칭 프로그램", preview: "/coaching/next-chapter" },
  { slug: "founder", href: "/coaching/founder", title: "Founder Transition", subtitle: "창업자에서 리더로 가는 6주", group: "코칭 프로그램", preview: "/coaching/founder" },
  { slug: "leadership", href: "/coaching/leadership", title: "Your Next Leadership", subtitle: "사람을 이끄는 리더십 코칭", group: "코칭 프로그램", preview: "/coaching/leadership" },
  { slug: "check", href: "/check", title: "진단", subtitle: "Founder Transition 문답표", group: "코칭 프로그램", preview: "/check" },
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
