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

  const programs = pages.home.programs.map((item) => {
    const extra = extras.get(item.href);
    return {
      ...item,
      axis: extra?.axis,
      process: extra?.process,
    };
  });

  return (
    <CoachingFilm
      programs={programs}
      openHrefs={[
        ...programs.filter((item) => isMenuHrefOn(item.href, menuOff, menuOn)).map((item) => item.href),
        ...COACHING_LINKS.filter((item) => isMenuHrefOn(item.href, menuOff, menuOn)).map((item) => item.href),
      ]}
    />
  );
}
