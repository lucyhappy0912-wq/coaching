import { BAND_COPY } from "@/lib/check/copy";
import type { CheckScores } from "@/lib/check/compute";
import { PRIORITY_AREA_COPY, PRIORITY_CLOSE, PRIORITY_INTRO } from "@/lib/check/priority-copy";
import { AREA_IDS, AREAS } from "@/lib/check/questions";
import { PillButton } from "@/components/ui/Buttons";

function PrioritySheets({
  scores,
  empty,
}: {
  scores: CheckScores;
  empty?: string;
}) {
  const priorityAreas = scores.priorityAreas;
  if (priorityAreas.length === 0) {
    return empty ? <p className="b3 text-ink-70">{empty}</p> : null;
  }

  return (
    <>
      <section className="mt-8 border border-forest-20 bg-white p-7 first:mt-0 lg:p-10">
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">{PRIORITY_INTRO.eyebrow}</p>
        <p className="serif t3 mt-3">{PRIORITY_INTRO.title}</p>
        <p className="b3 mt-5 text-ink-70">{PRIORITY_INTRO.lead}</p>
        <p className="b3 mt-4 text-ink-70">{PRIORITY_INTRO.body}</p>
      </section>

      {priorityAreas.map((id) => {
        const copy = PRIORITY_AREA_COPY[id];
        const score = scores.areas[id];
        return (
          <article
            key={id}
            id={`priority-${id}`}
            className="mt-8 scroll-mt-24 border border-forest-20 bg-white p-7 lg:p-10"
          >
            <p className="c1 tracking-[0.2em] text-forest-70 uppercase">
              {copy.no}. {copy.title} · {score}점
            </p>
            <p className="serif t3 mt-3">{copy.lead}</p>

            <p className="b2 mt-8 font-semibold text-forest">현재 나타나고 있을 가능성이 높은 모습</p>
            {copy.now.map((p) => (
              <p key={p} className="b3 mt-4 text-ink-70">
                {p}
              </p>
            ))}

            <p className="b2 mt-8 font-semibold text-forest">왜 지금 Transition이 필요한가?</p>
            {copy.why.map((p) => (
              <p key={p} className="b3 mt-4 text-ink-70">
                {p}
              </p>
            ))}

            <p className="b2 mt-8 font-semibold text-forest">Founder Transition에서는</p>
            {copy.work.map((p) => (
              <p key={p} className="b3 mt-4 text-ink-70">
                {p}
              </p>
            ))}
          </article>
        );
      })}

      <section className="mt-8 border border-forest-20 bg-white p-7 lg:p-10">
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">{PRIORITY_CLOSE.eyebrow}</p>
        <p className="b3 mt-5 text-ink-70">{PRIORITY_CLOSE.lead}</p>
        <p className="b3 mt-4 text-ink-70">{PRIORITY_CLOSE.body}</p>
        <p className="b3 mt-4 text-ink-70">{PRIORITY_CLOSE.method}</p>
        <p className="b3 mt-4 text-ink-70">{PRIORITY_CLOSE.goal}</p>
        <p className="b3 mt-4 text-ink-70">{PRIORITY_CLOSE.shift}</p>
      </section>
    </>
  );
}

export function CheckReport({
  scores,
  showCta = true,
  variant = "full",
}: {
  scores: CheckScores;
  showCta?: boolean;
  variant?: "full" | "priority";
}) {
  const band = BAND_COPY[scores.band];
  const focus = new Set(scores.priorityAreas);

  if (variant === "priority") {
    return (
      <>
        <PrioritySheets
          scores={scores}
          empty="10점 이상 영역이 없어 상위 3개 분석표가 없습니다."
        />
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

      <section className="mt-8 border border-forest-20 bg-white p-7 lg:p-10">
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">AREA PROFILE</p>
        <p className="serif t3 mt-3">7개 영역 결과</p>
        <p className="b3 mt-4 text-ink-70">
          영역당 3~15점입니다. 10점 미만도 결과에 포함됩니다. 분석표는 10점 이상 상위 3개만
          아래에 따로 있습니다.
        </p>
        <ul className="mt-8 space-y-3">
          {AREA_IDS.map((id) => {
            const value = scores.areas[id];
            const hasSheet = focus.has(id);
            return (
              <li key={id} className="border-b border-ink-10 py-3 last:border-0">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="b2">
                      {AREAS[id].title}
                      {hasSheet ? (
                        <a href={`#priority-${id}`} className="c1 ml-2 lined text-forest-70">
                          분석표
                        </a>
                      ) : null}
                    </p>
                    <p className="b3 mt-1 text-ink-70">{AREAS[id].question}</p>
                  </div>
                  <p className="serif t4 shrink-0">{value}점</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <PrioritySheets scores={scores} />

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
