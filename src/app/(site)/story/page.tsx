import type { Metadata } from "next";

import { SectionPage } from "@/components/layout/PageFrame";
import { StoryTabs } from "@/components/sections/StoryTabs";

export const metadata: Metadata = {
  title: "Story",
  description: "질문으로 정리하고, 주간에 실행하고, 다시 맞춰 보는 코칭 진행 방식입니다.",
};

export default function StoryPage() {
  return (
    <SectionPage>
      <StoryTabs />
    </SectionPage>
  );
}
