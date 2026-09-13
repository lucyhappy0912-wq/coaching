import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CheckReport } from "@/components/check/CheckReport";
import { Container } from "@/components/ui/Container";
import { BAND_RESULT_NAME } from "@/lib/check/copy";
import { getByToken } from "@/lib/check/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Founder Transition 결과 분석",
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
        <h1 className="serif t1 mt-4">Founder Transition 결과 분석</h1>
        {found.record.identity.name.trim() ? (
          <p className="b3 mt-4 text-ink-70">
            {found.record.identity.name.trim()}님은 총점 {found.scores.total}점으로{" "}
            {BAND_RESULT_NAME[found.scores.band]}에 해당합니다.
          </p>
        ) : null}
        <div className="mt-12">
          <CheckReport scores={found.scores} />
        </div>
      </Container>
    </div>
  );
}
