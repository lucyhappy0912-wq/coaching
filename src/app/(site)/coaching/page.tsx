import type { Metadata } from "next";

import { CoachingFilm } from "@/components/content/CoachingFilm";
import { COACHING_LINKS } from "@/components/content/HinokPage";
import { getContent } from "@/lib/cms/store";
import { PROGRAM_TEASERS } from "@/lib/content";
import { isMenuHrefOn } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Coaching",
  description: "Founder Coaching. 창업자에서 리더로 가는 전환을 함께합니다.",
};

export default async function CoachingIndexPage() {
  const { pages, menuOff, menuOn } = await getContent();
  const extras = new Map(PROGRAM_TEASERS.map((item) => [item.href, item]));
  const heroById: Record<string, { image: string; video: string; tone: typeof pages.stage.hero.tone }> = {
    stage: pages.stage.hero,
    "next-chapter": pages.nextChapter.hero,
    founder: pages.founder.hero,
  };

  const programs = pages.home.programs.map((item) => {
    const extra = extras.get(item.href);
    const photo = heroById[item.id] ?? item;
    return {
      ...item,
      image: photo.image || item.image,
      video: photo.video || item.video,
      tone: photo.tone || item.tone,
      axis: extra?.axis,
      process: extra?.process,
    };
  });

  return (
    <CoachingFilm
      hero={pages.home.moment}
      programs={programs}
      openHrefs={[
        ...programs.filter((item) => isMenuHrefOn(item.href, menuOff, menuOn)).map((item) => item.href),
        ...COACHING_LINKS.filter((item) => isMenuHrefOn(item.href, menuOff, menuOn)).map(
          (item) => item.href,
        ),
      ]}
    />
  );
}
