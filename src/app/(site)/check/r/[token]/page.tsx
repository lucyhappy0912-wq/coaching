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

  const name = found.record.identity.name.trim();

  return (
    <div className="bg-grass-10 pt-(--header-h)">
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">Founder Transition Check</p>
        <h1 className="serif t3 mt-4 break-keep">Founder Transition 결과 분석</h1>
        {name ? <p className="serif t2 mt-6 text-forest">{name}</p> : null}
        <p className={name ? "b2 mt-2 text-ink-70" : "b2 mt-6 text-ink-70"}>
          총점 {found.scores.total}점 · {BAND_RESULT_NAME[found.scores.band]}
        </p>
        <div className="mt-12">
          <CheckReport scores={found.scores} />
        </div>
      </Container>
    </div>
  );
}
