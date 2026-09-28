import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHero } from "@/components/content/PageHero";
import { ConsultSection } from "@/components/sections/ConsultSection";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: "무료 상담 신청",
  description: "첫 상담은 무료입니다. 지금 어떤 상황인지 듣고 코칭이 필요한지부터 말씀드립니다.",
};

export default async function ConsultPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const { src } = await searchParams;
  if (src === "lift") redirect("/lift");
  await assertPublicHref("/consult");
  const content = await getContent();
  return (
    <>
      <PageHero
        eyebrow="Consult"
        title="먼저 이야기부터 들려주세요"
        lead="첫 상담은 무료입니다. 지금 어떤 상황인지 듣고, 코칭이 필요한지부터 솔직하게 말씀드립니다."
        image={HOME_VISUAL.next}
        objectPosition={VISUAL_POS.next}
        compact
      />
      <ConsultSection site={content.site} />
    </>
  );
}
