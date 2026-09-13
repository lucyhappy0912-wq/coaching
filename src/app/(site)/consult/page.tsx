import type { Metadata } from "next";

import { SectionPage } from "@/components/layout/PageFrame";
import { ConsultSection } from "@/components/sections/ConsultSection";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "무료 상담 신청",
  description: "첫 상담은 무료입니다. 지금 어떤 상황인지 듣고 코칭이 필요한지부터 말씀드립니다.",
};

export default async function ConsultPage() {
  await assertPublicHref("/consult");
  const content = await getContent();
  return (
    <SectionPage>
      <ConsultSection site={content.site} />
    </SectionPage>
  );
}
