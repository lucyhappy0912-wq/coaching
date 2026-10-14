import type { Metadata } from "next";

import { ServiceOffer } from "@/components/content/ServiceOffer";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: "Group Coaching",
  description: "같은 전환의 자리에 있는 사람들과 함께 방향을 점검하는 그룹 코칭입니다.",
};

export default async function GroupCoachingPage() {
  await assertPublicHref("/coaching/group");
  return (
    <ServiceOffer
      eyebrow="Group Coaching"
      title="함께 멈추고, 함께 다음을 정합니다"
      lead="같은 전환의 자리에 있는 사람들과 질문과 구조를 나눕니다. 답은 각자 안에서 찾습니다."
      image={HOME_VISUAL.transition}
      objectPosition={VISUAL_POS.transition}
    />
  );
}
