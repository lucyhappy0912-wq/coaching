import { MomentPin } from "@/components/home/MomentPin";
import { MomentScenes } from "@/components/home/MomentScenes";
import { ProgramScenes } from "@/components/home/ProgramScenes";
import { getContent } from "@/lib/cms/store";
import type { CmsHomeProgram, CmsPages } from "@/lib/cms/types";
import { menuToggleItems, visibleByHref } from "@/lib/menu";

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
      tone: "sage",
      image: pages.belief.hero.image,
      video: pages.belief.hero.video,
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
      image: pages.way.hero.image,
      video: pages.way.hero.video,
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
      tone: "forest",
      image: story.image,
      video: story.video,
    });
  }

  return scenes;
}

export default async function Home() {
  const { pages, menuOff, menuOn } = await getContent();

  return (
    <>
      <MomentPin moment={pages.home.moment} />
      <MomentScenes scenes={visibleByHref(momentScenes(pages), menuOff, menuOn)} />
      <ProgramScenes programs={visibleByHref(pages.home.programs, menuOff, menuOn)} />
    </>
  );
}
