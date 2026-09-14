import { CheckLeaveReplace } from "@/components/check/CheckLeaveReplace";
import { CheckReport, type LiftApplicant } from "@/components/check/CheckReport";
import { BAND_RESULT_NAME } from "@/lib/check/copy";
import type { CheckScores } from "@/lib/check/compute";

export function CheckResultView({
  name,
  scores,
  showCta = true,
  applicant,
}: {
  name?: string;
  scores: CheckScores;
  showCta?: boolean;
  applicant?: LiftApplicant;
}) {
  const trimmed = name?.trim() ?? "";

  return (
    <>
      <CheckLeaveReplace />
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">Founder Transition Check</p>
      <h1 className="serif t3 mt-4 break-keep">Founder Transition 결과 분석</h1>
      {trimmed ? (
        <p className="b2 mt-6 text-forest break-keep">
          <span className="text-forest font-medium">{trimmed}</span>님은 총점 {scores.total}점으로 {BAND_RESULT_NAME[scores.band]}에 해당합니다.
        </p>
      ) : (
        <p className="b2 mt-6 text-ink-70">
          총점 {scores.total}점 · {BAND_RESULT_NAME[scores.band]}
        </p>
      )}
      <div className="mt-12">
        <CheckReport
          key={[scores.band, scores.total, ...scores.priorityAreas].join("-")}
          scores={scores}
          showCta={showCta}
          applicant={applicant}
        />
      </div>
    </>
  );
}
