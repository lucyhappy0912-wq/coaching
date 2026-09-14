"use client";

import { useEffect, useRef, useState } from "react";

import { LinedLink, PillButton } from "@/components/ui/Buttons";
import { BAND_COPY } from "@/lib/check/copy";
import type { CheckScores } from "@/lib/check/compute";
import { LIFT_NEXT } from "@/lib/check/lift-copy";
import { PRIORITY_AREA_COPY, PRIORITY_CLOSE, PRIORITY_INTRO } from "@/lib/check/priority-copy";
import { AREA_IDS, AREAS, type AreaId } from "@/lib/check/questions";

const CARD = "border border-forest-20 bg-white p-7 lg:p-10";

const NAV_BTN = "serif lined min-h-11 text-forest";

type Part = { key: string; label: string };

function buildParts(priorityAreas: AreaId[]): Part[] {
  const parts: Part[] = [
    { key: "score", label: "총점" },
    { key: "areas", label: "영역" },
  ];
  if (priorityAreas.length > 0) {
    parts.push({ key: "intro", label: "상위 영역" });
    for (const id of priorityAreas) {
      parts.push({ key: `priority-${id}`, label: id });
    }
    parts.push({ key: "close", label: "연결" });
  }
  parts.push({ key: "lift", label: "LIFT" });
  return parts;
}

function ScoreCard({ scores }: { scores: CheckScores }) {
  const band = BAND_COPY[scores.band];
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">
        {band.label} · {band.range}
      </p>
      <p className="serif t3 mt-3 break-keep">총점 {scores.total}점</p>
      <p className="b3 mt-5 text-ink-70">{band.lead}</p>
      <p className="b3 mt-4 text-ink-70">{band.need}</p>
      <p className="b3 mt-4 text-ink-70">{band.help}</p>
    </section>
  );
}

function AreaProfile({
  scores,
  onOpenSheet,
}: {
  scores: CheckScores;
  onOpenSheet: (id: AreaId) => void;
}) {
  const focus = new Set(scores.priorityAreas);
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">AREA PROFILE</p>
      <p className="serif t3 mt-3 break-keep">7개 영역 결과</p>
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
                      <button
                        type="button"
                        onClick={() => onOpenSheet(id)}
                        className="c1 ml-2 lined cursor-pointer border-0 bg-transparent p-0 text-forest-70"
                      >
                        분석표
                      </button>
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
  );
}

function PriorityIntro() {
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">{PRIORITY_INTRO.eyebrow}</p>
      <p className="serif t3 mt-3 break-keep">{PRIORITY_INTRO.title}</p>
      <p className="b3 mt-5 text-ink-70">{PRIORITY_INTRO.lead}</p>
      <p className="b3 mt-4 text-ink-70">{PRIORITY_INTRO.body}</p>
    </section>
  );
}

function PriorityArticle({ id, score }: { id: AreaId; score: number }) {
  const copy = PRIORITY_AREA_COPY[id];
  return (
    <article className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">
        {copy.no}. {copy.title} · {score}점
      </p>
      <p className="serif t3 mt-3 break-keep">{copy.lead}</p>

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
}

function PriorityClose() {
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">{PRIORITY_CLOSE.eyebrow}</p>
      <p className="b3 mt-5 text-ink-70">{PRIORITY_CLOSE.lead}</p>
      <p className="b3 mt-4 text-ink-70">{PRIORITY_CLOSE.body}</p>
      <p className="b3 mt-4 text-ink-70">{PRIORITY_CLOSE.method}</p>
      <p className="b3 mt-4 text-ink-70">{PRIORITY_CLOSE.goal}</p>
      <p className="b3 mt-4 text-ink-70">{PRIORITY_CLOSE.shift}</p>
    </section>
  );
}

function LiftNextSheet({ showCta }: { showCta: boolean }) {
  return (
    <>
      <section className={CARD}>
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">{LIFT_NEXT.eyebrow}</p>
        <p className="serif t3 mt-3 break-keep">{LIFT_NEXT.title}</p>
        {LIFT_NEXT.stanzas.map((stanza, i) => (
          <p
            key={stanza}
            className={`b3 whitespace-pre-line text-ink-70 ${i === 0 ? "mt-5" : "mt-4"}`}
          >
            {stanza}
          </p>
        ))}
      </section>
      {showCta ? (
        <section className="mt-16 flex flex-col gap-4">
          <PillButton href={LIFT_NEXT.href}>{LIFT_NEXT.cta}</PillButton>
          <LinedLink href="/" className="text-forest">
            홈으로
          </LinedLink>
        </section>
      ) : null}
    </>
  );
}

export function CheckReport({
  scores,
  showCta = true,
}: {
  scores: CheckScores;
  showCta?: boolean;
}) {
  const parts = buildParts(scores.priorityAreas);
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const skipScroll = useRef(true);

  const current = parts[step] ?? parts[0];
  const last = parts.length - 1;

  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function openAreaSheet(id: AreaId) {
    const i = parts.findIndex((part) => part.key === `priority-${id}`);
    if (i < 0) return;
    setStep(i);
  }

  function renderPart(part: Part) {
    if (part.key === "score") return <ScoreCard scores={scores} />;
    if (part.key === "areas") return <AreaProfile scores={scores} onOpenSheet={openAreaSheet} />;
    if (part.key === "intro") return <PriorityIntro />;
    if (part.key === "close") return <PriorityClose />;
    if (part.key === "lift") return <LiftNextSheet showCta={showCta} />;
    if (part.key.startsWith("priority-")) {
      const id = part.key.slice("priority-".length) as AreaId;
      return <PriorityArticle id={id} score={scores.areas[id]} />;
    }
    return null;
  }

  return (
    <div ref={rootRef} className="scroll-mt-24">
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">
        {step + 1} / {parts.length} · {current.label}
      </p>
      <div className="mt-6">{renderPart(current)}</div>
      <nav className="mt-10 flex items-center justify-between gap-4" aria-label="분석지 파트">
        {step > 0 ? (
          <button type="button" className={NAV_BTN} onClick={() => setStep((s) => s - 1)}>
            이전
          </button>
        ) : (
          <span />
        )}
        {step < last ? (
          <button type="button" className={NAV_BTN} onClick={() => setStep((s) => s + 1)}>
            다음
          </button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
