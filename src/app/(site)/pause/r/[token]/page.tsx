import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PauseResultView } from "@/components/pause/PauseResultView";
import { Container } from "@/components/ui/Container";
import { getPauseByToken } from "@/lib/pause/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PAUSE CHECK 결과 분석",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PauseResultPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const found = await getPauseByToken(token);
  if (!found) notFound();

  return (
    <div className="bg-grass-10 pt-(--header-h)">
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <PauseResultView name={found.record.identity.name} scores={found.scores} />
      </Container>
    </div>
  );
}
