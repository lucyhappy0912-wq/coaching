import type { Metadata } from "next";

import { PageHero } from "@/components/content/PageHero";
import { Faq } from "@/components/sections/Faq";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: "FAQ",
  description: "일과 병행, 대상, 온라인 진행, 첫 상담 비용에 대한 안내입니다.",
};

export default async function FaqPage() {
  await assertPublicHref("/faq");
  const content = await getContent();
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="자주 묻는 질문"
        lead="일과 병행, 대상, 온라인 진행, 첫 상담 비용에 대한 안내입니다."
        image={HOME_VISUAL.stairs}
        objectPosition={VISUAL_POS.stairs}
        compact
      />
      <Faq faqs={content.faqs} />
    </>
  );
}
