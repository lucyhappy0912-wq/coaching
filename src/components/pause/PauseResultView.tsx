import { CheckLeaveReplace } from "@/components/check/CheckLeaveReplace";
import { PauseReport } from "@/components/pause/PauseReport";
import type { PauseScores } from "@/lib/pause/compute";
import { PAUSE_BAND_NAME } from "@/lib/pause/copy";

export function PauseResultView({
  name,
  scores,
}: {
  name?: string;
  scores: PauseScores;
}) {
  const trimmed = name?.trim() ?? "";

  return (
    <>
      <CheckLeaveReplace />
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">PAUSE CHECK</p>
      <h1 className="serif t3 mt-4 break-keep">PAUSE CHECK 결과 분석</h1>
      {trimmed ? (
        <p className="b2 mt-6 text-forest break-keep">
          <span className="text-forest font-medium">{trimmed}</span>님은 총점 {scores.total}점으로 {PAUSE_BAND_NAME[scores.band]}에
          해당합니다.
        </p>
      ) : (
        <p className="b2 mt-6 text-ink-70">
          총점 {scores.total}점 · {PAUSE_BAND_NAME[scores.band]}
        </p>
      )}
      <div className="mt-12">
        <PauseReport key={[scores.band, scores.total, ...scores.highKeys].join("-")} scores={scores} />
      </div>
    </>
  );
}
