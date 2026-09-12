import { BAND_COPY } from "@/lib/check/copy";
import type { CheckScores } from "@/lib/check/compute";
import { PillButton } from "@/components/ui/Buttons";

export function CheckReport({
  scores,
  showCta = true,
}: {
  scores: CheckScores;
  showCta?: boolean;
}) {
  const band = BAND_COPY[scores.band];

  return (
    <>
      <section className="border border-forest-20 bg-white p-7 lg:p-10">
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">
          {band.label} · {band.range}
        </p>
        <p className="serif t3 mt-3">총점 {scores.total}점</p>
        <p className="b3 mt-5 text-ink-70">{band.lead}</p>
        <p className="b3 mt-4 text-ink-70">{band.need}</p>
        <p className="b3 mt-4 text-ink-70">{band.help}</p>
      </section>

      {showCta ? (
        <section className="mt-16 flex flex-col gap-4">
          <PillButton href="/consult">상담 신청</PillButton>
          <a href="/" className="lined b3 text-forest">
            홈으로
          </a>
        </section>
      ) : null}
    </>
  );
}
