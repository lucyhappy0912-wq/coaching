import {
  BELIEF_CLOSE,
  BELIEFS,
  BRAND_WHY,
  FOUNDER_PROGRAM,
  HOME_MOMENT,
  NEXT_CHAPTER_PROGRAM,
  PROGRAM_TEASERS,
  STAGE_PROGRAM,
  WAY,
} from "@/lib/content";

import type { CmsProgramPage, CmsPages, CmsWeek, MediaRef, PhotoTone } from "./types";

const media = (tone: PhotoTone, image: string): MediaRef => ({
  tone,
  image,
  video: "",
});

const WEEK_IMAGES = [
  "/media/stage-hero.jpg",
  "/media/week-see.jpg",
  "/media/story-pause.jpg",
  "/media/way-hero.jpg",
  "/media/chapter-hero.jpg",
  "/media/week-move.jpg",
];

const WEEK_TONES: PhotoTone[] = ["sage", "mist", "paper", "dusk", "sage", "mist"];

function weeksOf(
  source: { week: string; stage: string; title: string; body: string[]; change: { from: string; to: string } }[],
  images = WEEK_IMAGES,
  tones = WEEK_TONES,
): CmsWeek[] {
  return source.map((item, index) => ({
    ...media(tones[index % tones.length], images[index % images.length]),
    week: item.week,
    stage: item.stage,
    title: item.title,
    body: [...item.body],
    from: item.change.from,
    to: item.change.to,
  }));
}

const EMPTY_AFTER = {
  title: "",
  lead: "",
  close: "",
  pairs: [] as { before: string; after: string }[],
};

function programPage(
  source: {
    eyebrow: string;
    title: string;
    lead: string;
    intro: string[];
    process: string[];
    tone: PhotoTone;
    weeks: { week: string; stage: string; title: string; body: string[]; change: { from: string; to: string } }[];
  },
  teaserIndex: number,
  heroImage: string,
  splitImage: string,
  extras: Partial<CmsProgramPage> = {},
): CmsProgramPage {
  const teaser = PROGRAM_TEASERS[teaserIndex];
  return {
    eyebrow: source.eyebrow,
    title: source.title,
    lead: source.lead,
    line: teaser.line,
    intro: [...source.intro],
    process: [...source.process],
    hero: media(source.tone, heroImage),
    split: media(teaserIndex === 2 ? "dusk" : teaserIndex === 1 ? "dusk" : "mist", splitImage),
    weeks: weeksOf(source.weeks),
    weeksIntro: [],
    after: EMPTY_AFTER,
    ...extras,
  };
}

export function pagesSeed(): CmsPages {
  return {
    home: {
      moment: {
        ...media("forest", "/media/home-moment.jpg"),
        eyebrow: HOME_MOMENT.eyebrow,
        lines: [...HOME_MOMENT.lines],
        body: HOME_MOMENT.body,
      },
      programs: PROGRAM_TEASERS.map((item, index) => ({
        id: item.id,
        eyebrow: item.eyebrow,
        line: item.line,
        title: item.title,
        lead: [...item.lead],
        href: item.href,
        cta: item.cta,
        ...media(
          item.tone,
          ["/media/home-stage.jpg", "/media/home-next.jpg", "/media/home-founder.jpg"][index] ?? "/media/home-stage.jpg",
        ),
      })),
    },
    story: {
      slides: [
        {
          id: "ask",
          title: "멈춰야 비로소\n보이는 것이 있습니다.",
          lines: [BRAND_WHY.paragraphs[0], BRAND_WHY.paragraphs[1], BRAND_WHY.paragraphs[3]],
          ...media("forest", "/media/home-moment.jpg"),
        },
        {
          id: "pause",
          title: BRAND_WHY.lead,
          lines: [BRAND_WHY.paragraphs[2], BRAND_WHY.paragraphs[4]],
          ...media("dusk", "/media/story-pause.jpg"),
        },
        {
          id: "why",
          title: "WHY 멈춘자",
          lines: [BRAND_WHY.paragraphs[5], BRAND_WHY.paragraphs[6], BRAND_WHY.paragraphs[7]],
          ...media("forest", "/media/belief-hero.jpg"),
        },
      ],
    },
    way: {
      hero: {
        ...media("forest", "/media/way-hero.jpg"),
        eyebrow: WAY.eyebrow,
        title: WAY.title,
      },
      items: WAY.items.map((item, index) => ({
        no: item.no,
        title: item.title,
        body: [...item.body],
        ...media(
          (["paper", "sage", "mist", "dusk", "forest"] as PhotoTone[])[index],
          [
            "/media/story-pause.jpg",
            "/media/home-stage.jpg",
            "/media/stage-hero.jpg",
            "/media/home-moment.jpg",
            "/media/chapter-hero.jpg",
          ][index] ?? "/media/way-hero.jpg",
        ),
      })),
    },
    belief: {
      hero: {
        ...media("forest", "/media/belief-hero.jpg"),
        chain: BELIEF_CLOSE.chain,
        line: BELIEF_CLOSE.line,
      },
      items: BELIEFS.map((item, index) => ({
        no: item.no,
        en: item.en,
        title: item.title,
        body: [...item.body],
        ...media(
          (["dusk", "forest", "mist", "dusk"] as PhotoTone[])[index],
          ["/media/story-pause.jpg", "/media/week-see.jpg", "/media/way-hero.jpg", "/media/week-move.jpg"][index] ??
            "/media/belief-hero.jpg",
        ),
      })),
      close: [...BELIEF_CLOSE.close],
    },
    stage: programPage(STAGE_PROGRAM, 0, "/media/stage-hero.jpg", "/media/home-stage.jpg"),
    nextChapter: programPage(NEXT_CHAPTER_PROGRAM, 1, "/media/chapter-hero.jpg", "/media/home-next.jpg", {
      weeks: weeksOf(NEXT_CHAPTER_PROGRAM.weeks, [
        "/media/chapter-hero.jpg",
        "/media/week-see.jpg",
        "/media/home-stage.jpg",
        "/media/home-next.jpg",
        "/media/way-hero.jpg",
        "/media/week-move.jpg",
      ]),
    }),
    founder: programPage(FOUNDER_PROGRAM, 2, "/media/founder-hero.jpg", "/media/home-founder.jpg", {
      weeksIntro: [...FOUNDER_PROGRAM.weeksIntro],
      after: {
        title: FOUNDER_PROGRAM.after.title,
        lead: FOUNDER_PROGRAM.after.lead,
        close: FOUNDER_PROGRAM.after.close,
        pairs: FOUNDER_PROGRAM.after.pairs.map((pair) => ({ ...pair })),
      },
    }),
    leadership: {
      hero: {
        ...media("dusk", "/media/leadership-hero.jpg"),
        eyebrow: FOUNDER_PROGRAM.next.eyebrow,
        line: FOUNDER_PROGRAM.next.line,
        meta: FOUNDER_PROGRAM.next.meta,
      },
      split: media("forest", "/media/founder-hero.jpg"),
      body: [...FOUNDER_PROGRAM.next.body],
    },
    check: {
      ...media("forest", "/media/check-hero.jpg"),
      eyebrow: "Founder Transition Check",
      title: "회사의 다음 단계에 앞서,\nFounder 자신을 점검합니다.",
    },
  };
}
