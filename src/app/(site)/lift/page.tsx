import type { Metadata } from "next";

import { LiftNextSheet } from "@/components/check/LiftNextSheet";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { LIFT_NEXT } from "@/lib/check/lift-copy";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: LIFT_NEXT.cta.replace(" 신청하기", ""),
  description: LIFT_NEXT.title,
};

export default async function LiftPage() {
  await assertPublicHref("/lift");
  return (
    <div className="bg-[#f7f6f3]">
      <PageHero
        eyebrow="LIFT"
        title={LIFT_NEXT.title}
        image={HOME_VISUAL.next}
        objectPosition={VISUAL_POS.next}
        compact
      />
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <LiftNextSheet showCta showHomeLink={false} />
      </Container>
    </div>
  );
}
