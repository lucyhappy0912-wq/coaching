import type { Metadata } from "next";

import { SectionPage } from "@/components/layout/PageFrame";
import { CoachBand } from "@/components/sections/CoachBand";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Coach",
  description: "방향은 본인이 정합니다. 그 결정을 대신하지 않고 끝까지 함께 점검합니다.",
};

export default async function CoachPage() {
  const content = await getContent();
  return (
    <SectionPage>
      <CoachBand coach={content.coach} />
    </SectionPage>
  );
}
