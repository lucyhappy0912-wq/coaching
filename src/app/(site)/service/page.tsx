import type { Metadata } from "next";

import { PageHero } from "@/components/content/PageHero";
import { Services } from "@/components/sections/Services";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: "Service",
  description: "무료 상담, 세션 기록, 그룹 세션, 이후 관리.",
};

export default function ServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Service"
        title="함께하는 방식"
        lead="무료 상담, 세션 기록, 그룹 세션, 이후 관리."
        image={HOME_VISUAL.transition}
        objectPosition={VISUAL_POS.transition}
        compact
      />
      <Services />
    </>
  );
}
