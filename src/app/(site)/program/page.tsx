import type { Metadata } from "next";

import { SectionPage } from "@/components/layout/PageFrame";
import { ProgramTabs } from "@/components/sections/ProgramTabs";

export const metadata: Metadata = {
  title: "Program",
  description: "진단 세션, 주간 1:1 코칭, 온라인 코칭. 상담 후 맞는 프로그램을 안내합니다.",
};

export default function ProgramPage() {
  return (
    <SectionPage>
      <ProgramTabs />
    </SectionPage>
  );
}
