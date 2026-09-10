import type { Metadata } from "next";

import { CheckForm } from "@/components/check/CheckForm";
import { Container } from "@/components/ui/Container";

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

  return (
    <div className="bg-grass-10 pt-(--header-h)">
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <CheckForm source={source} />
      </Container>
    </div>
  );
}
