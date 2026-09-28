import { HomeClose } from "@/components/home/HomeClose";
import { HomeHero } from "@/components/home/HomeHero";
import { HomePause } from "@/components/home/HomePause";
import { HomeProcess } from "@/components/home/HomeProcess";
import { MomentScenes } from "@/components/home/MomentScenes";
import { ProgramScenes } from "@/components/home/ProgramScenes";
import { getContent } from "@/lib/cms/store";
import type { CmsHomeProgram, CmsPages } from "@/lib/cms/types";
import { menuToggleItems, visibleByHref } from "@/lib/menu";
import { HOME_VISUAL } from "@/lib/visual";

function menuLabel(href: string) {
  return menuToggleItems().find((item) => item.href === href)?.label ?? href;
}

function momentScenes(pages: CmsPages): CmsHomeProgram[] {
  const story = pages.story.slides[0];
  const scenes: CmsHomeProgram[] = [
    {
      id: "belief",
      eyebrow: pages.belief.hero.chain,
      line: menuLabel("/belief"),
      title: menuLabel("/belief"),
      lead: [pages.belief.hero.line],
      href: "/belief",
      cta: "Our Belief 보기",
      tone: "paper",
      image: HOME_VISUAL.pause,
      video: "",
    },
    {
      id: "way",
      eyebrow: pages.way.hero.eyebrow,
      line: menuLabel("/way"),
      title: menuLabel("/way"),
      lead: [pages.way.hero.title],
      href: "/way",
      cta: "Meomchunja Way 보기",
      tone: "paper",
      image: HOME_VISUAL.transition,
      video: "",
    },
  ];

  if (story) {
    scenes.push({
      id: "story",
      eyebrow: "",
      line: menuLabel("/story"),
      title: menuLabel("/story"),
      lead: [story.lines[1] || story.title.replace(/\n/g, " ")],
      href: "/story",
      cta: "How we transition 보기",
      tone: "paper",
      image: HOME_VISUAL.stairs,
      video: "",
    });
  }

  return scenes;
}

const PROGRAM_IMAGE: Record<string, string> = {
  stage: HOME_VISUAL.stairs,
  "next-chapter": HOME_VISUAL.next,
  founder: HOME_VISUAL.founder,
};

export default async function Home() {
  const { pages, menuOff, menuOn } = await getContent();
  const programs = visibleByHref(pages.home.programs, menuOff, menuOn).map((item) => ({
    ...item,
    image: PROGRAM_IMAGE[item.id] ?? item.image,
    video: "",
    tone: "paper" as const,
  }));

  return (
    <>
      <HomeHero moment={pages.home.moment} />
      <HomePause />
      <HomeProcess />
      <MomentScenes scenes={visibleByHref(momentScenes(pages), menuOff, menuOn)} />
      <ProgramScenes programs={programs} />
      <HomeClose />
    </>
  );
}
