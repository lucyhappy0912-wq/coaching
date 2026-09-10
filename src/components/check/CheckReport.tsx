import { CTA, BAND_COPY, ITEM_COPY } from "@/lib/check/copy";
import { AREAS, QUESTIONS } from "@/lib/check/questions";
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
  const cta = CTA[scores.band];
  const high = QUESTIONS.filter((q) => scores.highKeys.includes(q.key));
  const mid = QUESTIONS.filter((q) => scores.midKeys.includes(q.key));

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

      <section className="mt-12">
        <h2 className="serif t3">영역 프로필</h2>
        <ul className="mt-6 space-y-3">
          {Object.entries(scores.areas).map(([id, value]) => (
            <li key={id} className="flex items-center justify-between border-b border-ink-10 py-2">
              <span className="b2">
                {AREAS[id as keyof typeof AREAS].title}
                {scores.topAreas.includes(id as keyof typeof AREAS) ? (
                  <span className="c1 ml-2 text-forest-70">높은 신호</span>
                ) : null}
              </span>
              <span className="serif t4">{value}</span>
            </li>
          ))}
        </ul>
        {scores.topAreas.map((id) => (
          <p key={id} className="b3 mt-5 text-ink-70">
            {AREAS[id].wrap}
          </p>
        ))}
      </section>

      {high.length > 0 && (
        <section className="mt-16">
          <h2 className="serif t3">신호가 강한 문항</h2>
          <p className="b3 mt-3 text-ink-70">4점·5점을 고른 문항입니다.</p>
          <ol className="mt-8 space-y-10">
            {high.map((q) => (
              <li key={q.key}>
                <p className="c1 tracking-[0.15em] text-forest-70 uppercase">
                  {String(q.no).padStart(2, "0")}. {q.label}
                </p>
                <p className="b2 mt-2">{q.prompt}</p>
                <p className="b3 mt-3 text-ink-70">{ITEM_COPY[q.key].high}</p>
                <p className="b3 mt-3 text-forest">Transition Point · {q.transitionPoint}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {mid.length > 0 && (
        <section className="mt-16">
          <h2 className="serif t3">아직 판단이 열린 지점</h2>
          <ul className="b3 mt-5 space-y-2 text-ink-70">
            {mid.map((q) => (
              <li key={q.key}>
                {String(q.no).padStart(2, "0")}. {q.label} — {ITEM_COPY[q.key].mid}
              </li>
            ))}
          </ul>
        </section>
      )}

      {scores.quietAreas.length > 0 && (
        <p className="b3 mt-10 text-ink-70">
          {scores.quietAreas.map((id) => AREAS[id].title).join(", ")} 영역은 이번 응답에서 신호가
          적었습니다.
        </p>
      )}

      {showCta && (
        <section className="mt-16 border border-forest-20 bg-white p-7 lg:p-10">
          <p className="b3 text-ink-70">
            FOUNDER TRANSITION은 정해진 리더의 모습을 제시하지 않습니다. 지금의 방식이 틀렸기 때문에
            바꾸는 것이 아니라, 지금까지의 방식으로 여기까지 왔기 때문에 다음 방식이 필요할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            <PillButton href={cta.primary.href}>{cta.primary.label}</PillButton>
            {cta.secondary && (
              <a href={cta.secondary.href} className="lined b3 text-forest">
                {cta.secondary.label}
              </a>
            )}
          </div>
        </section>
      )}
    </>
  );
}
