import type { Metadata } from "next";

import { PauseForm } from "@/components/pause/PauseForm";
import { Photo } from "@/components/ui/Photo";
import { Container } from "@/components/ui/Container";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { PAUSE_INTRO } from "@/lib/pause/copy";

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
    <div className="bg-grass-10">
      <header className="relative min-h-[46vh] overflow-hidden bg-forest text-white">
        <Photo src="/media/check-hero.jpg" tone="forest" alt="" className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex min-h-[46vh] flex-col justify-end px-(--gutter) pt-(--header-h) pb-12">
          <p className="c1 tracking-[0.22em] text-white/55 uppercase">{PAUSE_INTRO.eyebrow}</p>
          <h1 className="serif mt-4 max-w-3xl break-keep text-[32px] leading-[1.15] whitespace-pre-line lg:text-[48px]">
            {PAUSE_INTRO.title}
          </h1>
        </div>
      </header>
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <PauseForm source={source} />
      </Container>
    </div>
  );
}
