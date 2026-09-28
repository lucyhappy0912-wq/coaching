import type { Metadata } from "next";

import { PageHero } from "@/components/content/PageHero";
import { PauseForm } from "@/components/pause/PauseForm";
import { Container } from "@/components/ui/Container";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { PAUSE_INTRO } from "@/lib/pause/copy";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export const metadata: Metadata = {
  title: "PAUSE CHECK",
  description:
    "지금, 당신에게 멈춤이 필요한 순간인가요? 현재의 삶과 변화의 신호를 돌아보는 30문항 자기점검입니다.",
  robots: { index: true, follow: true },
};

export default async function PausePage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  await assertPublicHref("/pause");
  const { src } = await searchParams;
  const source = src && /^[a-z0-9_-]{1,40}$/i.test(src) ? src : "direct";

  return (
    <div className="bg-[#f7f6f3]">
      <PageHero
        eyebrow={PAUSE_INTRO.eyebrow}
        title={PAUSE_INTRO.title}
        image={HOME_VISUAL.pause}
        objectPosition={VISUAL_POS.pause}
        compact
      />
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <PauseForm source={source} />
      </Container>
    </div>
  );
}
