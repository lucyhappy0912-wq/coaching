import type { Answers, CheckScores } from "@/lib/check/compute";
import { AREA_IDS, AREAS, LIKERT_LABELS, QUESTIONS } from "@/lib/check/questions";

export function AdminCheckAreas({
  answers,
  scores,
}: {
  answers: Answers;
  scores: CheckScores;
}) {
  const focus = new Set(scores.priorityAreas);

  return (
    <section className="mt-6 rounded-[6px] border border-ink-15 bg-white p-5">
      <h2 className="adm-h text-forest">영역별 점수</h2>
      <p className="adm-body mt-2 text-ink-70">
        주제를 누르면 문항 답을 봅니다. 10점 이상 상위 3개는 분석표 표시가 있습니다.
      </p>
      <div className="mt-4 border-t border-ink-10">
        {AREA_IDS.map((areaId) => {
          const questions = QUESTIONS.filter((q) => q.area === areaId);
          const total = scores.areas[areaId];
          const hasSheet = focus.has(areaId);
          return (
            <details
              key={areaId}
              className="group border-b border-ink-10 last:border-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span className="adm-h text-forest">{AREAS[areaId].title}</span>
                  {hasSheet ? <span className="adm-meta ml-2 text-forest-70">분석표</span> : null}
                  <span className="adm-body mt-1 block text-ink-70">{AREAS[areaId].question}</span>
                </span>
                <span className="adm-h shrink-0 text-forest">{total}점</span>
              </summary>
              <ol className="space-y-4 pb-5">
                {questions.map((q) => {
                  const score = answers[q.key];
                  const choice = LIKERT_LABELS.find((item) => item.value === score)?.label ?? "";
                  return (
                    <li key={q.key} className="rounded-[4px] bg-ink-05 px-3 py-3">
                      <p className="adm-label text-forest-70">
                        {String(q.no).padStart(2, "0")} · {q.label}
                      </p>
                      <p className="adm-body mt-2 text-ink-90">{q.prompt}</p>
                      <p className="adm-body mt-2 font-medium text-forest">
                        {score}점 · {choice}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </details>
          );
        })}
      </div>
    </section>
  );
}
