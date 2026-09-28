import type { Metadata } from "next";

import { PageHero } from "@/components/content/PageHero";
import { ProgramTabs } from "@/components/sections/ProgramTabs";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: "Program",
  description: "진단 세션, 주간 1:1 코칭, 온라인 코칭. 상담 후 맞는 프로그램을 안내합니다.",
};

export default function ProgramPage() {
  return (
    <>
      <PageHero
        eyebrow="Program"
        title="상담 후 맞는 프로그램을 안내합니다"
        lead="진단 세션, 주간 1:1 코칭, 온라인 코칭."
        image={HOME_VISUAL.stairs}
        objectPosition={VISUAL_POS.stairs}
        compact
      />
      <ProgramTabs />
    </>
  );
}
