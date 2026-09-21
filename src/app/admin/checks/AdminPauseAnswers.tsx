import { LIKERT_LABELS, PAUSE_QUESTIONS } from "@/lib/pause/questions";
import type { PauseAnswers, PauseScores } from "@/lib/pause/compute";

export function AdminPauseAnswers({
  answers,
  scores,
}: {
  answers: PauseAnswers;
  scores: PauseScores;
}) {
  return (
    <section className="mt-6 rounded-[6px] border border-ink-15 bg-white p-5">
      <h2 className="adm-h text-forest">PAUSE CHECK 응답</h2>
      <p className="adm-body mt-2 text-ink-70">
        {scores.band} · 총점 {scores.total}점 · 4점 이상 {scores.highKeys.length}문항
      </p>
      <ol className="mt-6 space-y-4">
        {PAUSE_QUESTIONS.map((q) => {
          const value = answers[q.key];
          const label = LIKERT_LABELS.find((item) => item.value === value)?.label ?? "";
          return (
            <li key={q.key} className="border-b border-ink-10 pb-4 last:border-0 last:pb-0">
              <p className="adm-label text-forest-70">{String(q.no).padStart(2, "0")}</p>
              <p className="adm-body mt-1 text-ink-90">{q.prompt}</p>
              <p className="adm-meta mt-2 text-forest">
                {value}점 · {label}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
