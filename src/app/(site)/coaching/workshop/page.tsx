import type { Metadata } from "next";

import { ServiceOffer } from "@/components/content/ServiceOffer";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: "Coaching Workshop",
  description: "조직과 팀을 위한 전환 워크숍입니다.",
};

export default async function CoachingWorkshopPage() {
  await assertPublicHref("/coaching/workshop");
  return (
    <ServiceOffer
      eyebrow="Coaching Workshop"
      title="팀이 방향을 같이 보는 시간"
      lead="한 번의 워크숍으로 지금의 구조와 다음 선택을 펼쳐 놓습니다."
      image={HOME_VISUAL.stairs}
      objectPosition={VISUAL_POS.stairs}
    />
  );
}
