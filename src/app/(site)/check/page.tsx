import type { Metadata } from "next";

import { CheckForm } from "@/components/check/CheckForm";
import { Photo } from "@/components/ui/Photo";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Founder Transition Check",
  description:
    "회사의 다음 단계에 앞서 Founder 자신을 점검하는 21문항. 제출 직후 분석지를 보여 드립니다.",
  robots: { index: true, follow: true },
};

export default async function CheckPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const { src } = await searchParams;
  const source = src && /^[a-z0-9_-]{1,40}$/i.test(src) ? src : "direct";
  const { pages } = await getContent();
  const check = pages.check;

  return (
    <div className="bg-grass-10">
      <header className="relative min-h-[46vh] overflow-hidden bg-forest text-white">
        <Photo src={check.image} video={check.video} tone={check.tone} alt="" className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex min-h-[46vh] flex-col justify-end px-(--gutter) pt-(--header-h) pb-12">
          <p className="c1 tracking-[0.22em] text-white/55 uppercase">{check.eyebrow}</p>
          <h1 className="serif mt-4 max-w-3xl text-[32px] leading-[1.15] whitespace-pre-line lg:text-[48px]">
            {check.title}
          </h1>
        </div>
      </header>
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <CheckForm source={source} />
      </Container>
    </div>
  );
}
