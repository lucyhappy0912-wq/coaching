import type { Metadata } from "next";

import { ServiceOffer } from "@/components/content/ServiceOffer";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: "Coaching Speaking",
  description: "전환과 리더십을 주제로 한 강연입니다.",
};

export default async function CoachingSpeakingPage() {
  await assertPublicHref("/coaching/speaking");
  return (
    <ServiceOffer
      eyebrow="Coaching Speaking"
      title="멈추는 힘을 전합니다"
      lead="조직과 리더에게 PAUSE, TRANSITION, NEXT를 이야기합니다."
      image={HOME_VISUAL.next}
      objectPosition={VISUAL_POS.next}
    />
  );
}
