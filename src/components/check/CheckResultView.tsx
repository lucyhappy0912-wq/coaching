import { CheckReport } from "@/components/check/CheckReport";
import { BAND_RESULT_NAME } from "@/lib/check/copy";
import type { CheckScores } from "@/lib/check/compute";

export function CheckResultView({
  name,
  scores,
  showCta = true,
}: {
  name?: string;
  scores: CheckScores;
  showCta?: boolean;
}) {
  const trimmed = name?.trim() ?? "";

  return (
    <>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">Founder Transition Check</p>
      <h1 className="serif t3 mt-4 break-keep">Founder Transition 결과 분석</h1>
      {trimmed ? <p className="serif t2 mt-6 text-forest">{trimmed}</p> : null}
      <p className={trimmed ? "b2 mt-2 text-ink-70" : "b2 mt-6 text-ink-70"}>
        총점 {scores.total}점 · {BAND_RESULT_NAME[scores.band]}
      </p>
      <div className="mt-12">
        <CheckReport
          key={[scores.band, scores.total, ...scores.priorityAreas].join("-")}
          scores={scores}
          showCta={showCta}
        />
      </div>
    </>
  );
}
