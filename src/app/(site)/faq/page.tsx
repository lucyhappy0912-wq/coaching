import type { Metadata } from "next";

import { SectionPage } from "@/components/layout/PageFrame";
import { Faq } from "@/components/sections/Faq";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "FAQ",
  description: "일과 병행, 대상, 온라인 진행, 첫 상담 비용에 대한 안내입니다.",
};

export default async function FaqPage() {
  const content = await getContent();
  return (
    <SectionPage>
      <Faq faqs={content.faqs} />
    </SectionPage>
  );
}
