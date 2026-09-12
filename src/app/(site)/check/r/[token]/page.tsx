import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CheckReport } from "@/components/check/CheckReport";
import { Container } from "@/components/ui/Container";
import { getByToken } from "@/lib/check/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Founder Transition Check 분석지",
  robots: { index: false, follow: false, nocache: true },
};

export default async function CheckResultPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const found = await getByToken(token);
  if (!found) notFound();

  return (
    <div className="bg-grass-10 pt-(--header-h)">
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">Founder Transition Check</p>
        <h1 className="serif t1 mt-4">분석지</h1>
        <p className="b3 mt-4 text-ink-70">
          총점 구간과 7개 영역 점수는 모두 보입니다. 10점 이상 상위 3개 영역만 별도 분석표가
          붙습니다. 의학적·심리학적 진단이 아닙니다.
        </p>
        <p className="b3 mt-3 text-ink-70">
          이 주소를 잃어버리면{" "}
          <a href="/check/view" className="lined text-forest">
            이름·전화·이메일로 다시 열 수 있습니다
          </a>
          .
        </p>
        <div className="mt-12">
          <CheckReport scores={found.scores} />
        </div>
      </Container>
    </div>
  );
}
