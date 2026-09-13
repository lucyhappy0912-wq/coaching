import type { CmsPages, CmsProgramPage, CmsWeek, MediaRef } from "./types";

function pick(raw: string | undefined, seed: string) {
  return raw === undefined ? seed : raw;
}

/** 예전에 시드에 박혀 저장소에 남은 문구는 새 시드로 교체한다. */
function pickHomeCta(raw: string | undefined, seed: string) {
  if (raw === undefined || raw === "Stage Transition 더 알아보기") return seed;
  return raw;
}

function mediaOf(raw: Partial<MediaRef> | undefined, seed: MediaRef): MediaRef {
  return {
    tone: raw?.tone ?? seed.tone,
    image: pick(raw?.image, seed.image),
    video: raw?.video?.trim() ? raw.video : seed.video,
  };
}

function weekOf(raw: Partial<CmsWeek> | undefined, seed: CmsWeek): CmsWeek {
  return {
    ...mediaOf(raw, seed),
    week: pick(raw?.week, seed.week),
    stage: pick(raw?.stage, seed.stage),
    title: pick(raw?.title, seed.title),
    body: raw?.body?.length ? raw.body : seed.body,
    from: pick(raw?.from, seed.from),
    to: pick(raw?.to, seed.to),
  };
}

function programOf(raw: Partial<CmsProgramPage> | undefined, seed: CmsProgramPage): CmsProgramPage {
  if (!raw) return seed;
  return {
    eyebrow: pick(raw.eyebrow, seed.eyebrow),
    title: pick(raw.title, seed.title),
    lead: pick(raw.lead, seed.lead),
    line: pick(raw.line, seed.line),
    intro: raw.intro?.length ? raw.intro : seed.intro,
    process: raw.process?.length ? raw.process : seed.process,
    hero: mediaOf(raw.hero, seed.hero),
    split: mediaOf(raw.split, seed.split),
    weeks: seed.weeks.map((week, index) => weekOf(raw.weeks?.[index], week)),
    weeksIntro: raw.weeksIntro?.length ? raw.weeksIntro : seed.weeksIntro,
    after: {
      title: pick(raw.after?.title, seed.after.title),
      lead: pick(raw.after?.lead, seed.after.lead),
      close: pick(raw.after?.close, seed.after.close),
      pairs: raw.after?.pairs?.length ? raw.after.pairs : seed.after.pairs,
    },
  };
}

export function mergePages(raw: Partial<CmsPages> | undefined, seed: CmsPages): CmsPages {
  if (!raw) return seed;
  return {
    home: {
      moment: {
        ...mediaOf(raw.home?.moment, seed.home.moment),
        eyebrow: pick(raw.home?.moment?.eyebrow, seed.home.moment.eyebrow),
        lines: raw.home?.moment?.lines?.length ? raw.home.moment.lines : seed.home.moment.lines,
        body: pick(raw.home?.moment?.body, seed.home.moment.body),
      },
      programs: seed.home.programs.map((item, index) => {
        const next = raw.home?.programs?.[index];
        return {
          ...item,
          ...mediaOf(next, item),
          eyebrow: pick(next?.eyebrow, item.eyebrow),
          line: pick(next?.line, item.line),
          title: pick(next?.title, item.title),
          lead: next?.lead?.length ? next.lead : item.lead,
          href: pick(next?.href, item.href),
          cta: pickHomeCta(next?.cta, item.cta),
        };
      }),
    },
    story: {
      slides: seed.story.slides.map((slide, index) => {
        const next = raw.story?.slides?.[index];
        return {
          ...slide,
          ...mediaOf(next, slide),
          title: pick(next?.title, slide.title),
          lines: next?.lines?.length ? next.lines : slide.lines,
        };
      }),
    },
    way: {
      hero: {
        ...mediaOf(raw.way?.hero, seed.way.hero),
        eyebrow: pick(raw.way?.hero?.eyebrow, seed.way.hero.eyebrow),
        title: pick(raw.way?.hero?.title, seed.way.hero.title),
      },
      items: seed.way.items.map((item, index) => {
        const next = raw.way?.items?.[index];
        return {
          ...item,
          ...mediaOf(next, item),
          title: pick(next?.title, item.title),
          body: next?.body?.length ? next.body : item.body,
        };
      }),
    },
    belief: {
      hero: {
        ...mediaOf(raw.belief?.hero, seed.belief.hero),
        chain: pick(raw.belief?.hero?.chain, seed.belief.hero.chain),
        line: pick(raw.belief?.hero?.line, seed.belief.hero.line),
      },
      items: seed.belief.items.map((item, index) => {
        const next = raw.belief?.items?.[index];
        return {
          ...item,
          ...mediaOf(next, item),
          en: pick(next?.en, item.en),
          title: pick(next?.title, item.title),
          body: next?.body?.length ? next.body : item.body,
        };
      }),
      close: raw.belief?.close?.length ? raw.belief.close : seed.belief.close,
    },
    stage: programOf(raw.stage, seed.stage),
    nextChapter: programOf(raw.nextChapter, seed.nextChapter),
    founder: programOf(raw.founder, seed.founder),
    leadership: {
      hero: {
        ...mediaOf(raw.leadership?.hero, seed.leadership.hero),
        eyebrow: pick(raw.leadership?.hero?.eyebrow, seed.leadership.hero.eyebrow),
        line: pick(raw.leadership?.hero?.line, seed.leadership.hero.line),
        meta: pick(raw.leadership?.hero?.meta, seed.leadership.hero.meta),
      },
      split: mediaOf(raw.leadership?.split, seed.leadership.split),
      body: raw.leadership?.body?.length ? raw.leadership.body : seed.leadership.body,
    },
    check: {
      ...mediaOf(raw.check, seed.check),
      eyebrow: pick(raw.check?.eyebrow, seed.check.eyebrow),
      title: pick(raw.check?.title, seed.check.title),
    },
  };
}
