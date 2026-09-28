import type { Metadata } from "next";

import { CheckForm } from "@/components/check/CheckForm";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { getContent } from "@/lib/cms/store";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

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
  await assertPublicHref("/check");
  const { src } = await searchParams;
  const source = src && /^[a-z0-9_-]{1,40}$/i.test(src) ? src : "direct";
  const { pages } = await getContent();
  const check = pages.check;

  return (
    <div className="bg-[#f7f6f3]">
      <PageHero
        eyebrow={check.eyebrow}
        title={check.title}
        image={HOME_VISUAL.founder}
        objectPosition={VISUAL_POS.founder}
        compact
      />
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <CheckForm source={source} />
      </Container>
    </div>
  );
}
