"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { PauseScores } from "@/lib/pause/compute";
import { PAUSE_BAND_COPY, PAUSE_DISCLAIMER, PAUSE_PROCESS, PAUSE_SIGNAL_COPY } from "@/lib/pause/copy";
import { PAUSE_QUESTIONS } from "@/lib/pause/questions";

const CARD = "border border-forest-20 bg-white px-5 py-6 sm:p-7 lg:p-10";

const PREV_BTN = "serif lined min-h-11 text-forest";
const NEXT_BTN =
  "serif inline-flex h-11 items-center justify-center rounded-sm bg-forest px-7 text-[15px] text-white shadow-[0_4px_4px_0_rgba(0,58,64,0.1)] hover:bg-forest-90 lg:h-12 lg:px-8 lg:text-base";

const PARTS = [
  { key: "score", label: "총점" },
  { key: "signal", label: "SIGNAL" },
  { key: "process", label: "NEXT" },
  { key: "note", label: "안내" },
] as const;

function ScoreCard({ scores }: { scores: PauseScores }) {
  const band = PAUSE_BAND_COPY[scores.band];
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">
        {band.label} · {band.range}
      </p>
      <p className="serif t3 mt-3 break-keep">총점 {scores.total}점</p>
      {band.paragraphs.map((p) => (
        <p key={p} className="b3 mt-4 text-ink-70">
          {p}
        </p>
      ))}
      <p className="b2 mt-8 font-semibold text-forest">{band.need}</p>
      <p className="c1 mt-8 tracking-[0.16em] text-forest-70 uppercase">지금 나에게 던져볼 질문</p>
      <p className="serif mt-3 text-[20px] leading-snug">{band.question}</p>
    </section>
  );
}

function SignalCard({ scores }: { scores: PauseScores }) {
  const highs = PAUSE_QUESTIONS.filter((q) => scores.highKeys.includes(q.key));
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">{PAUSE_SIGNAL_COPY.eyebrow}</p>
      <p className="serif t3 mt-3 break-keep">{PAUSE_SIGNAL_COPY.title}</p>
      {PAUSE_SIGNAL_COPY.paragraphs.map((p) => (
        <p key={p} className="b3 mt-4 text-ink-70">
          {p}
        </p>
      ))}
      {highs.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {highs.map((q) => (
            <li key={q.key} className="border-b border-ink-10 pb-4 last:border-0 last:pb-0">
              <p className="c1 text-forest-70">{String(q.no).padStart(2, "0")}</p>
              <p className="b2 mt-2 text-ink-90">{q.prompt}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="b3 mt-8 text-ink-70">4점 또는 5점을 준 문항이 없습니다. 마음에 남는 문장을 다시 살펴보세요.</p>
      )}
      <ul className="mt-8 space-y-3">
        {PAUSE_SIGNAL_COPY.questions.map((q) => (
          <li key={q} className="b2 text-forest">
            {q}
          </li>
        ))}
      </ul>
      {PAUSE_SIGNAL_COPY.close.map((p) => (
        <p key={p} className="b3 mt-4 text-ink-70">
          {p}
        </p>
      ))}
    </section>
  );
}

function ProcessCard() {
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">{PAUSE_PROCESS.eyebrow}</p>
      <ul className="mt-8 space-y-6">
        {PAUSE_PROCESS.items.map((item) => (
          <li key={item.key}>
            <p className="c1 tracking-[0.16em] text-forest-70 uppercase">{item.key}</p>
            <p className="b2 mt-2 text-ink-90">{item.body}</p>
          </li>
        ))}
      </ul>
      {PAUSE_PROCESS.close.map((p) => (
        <p key={p} className="b3 mt-6 text-ink-70">
          {p}
        </p>
      ))}
    </section>
  );
}

function NoteCard() {
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">NOTE</p>
      <p className="b3 mt-5 text-ink-70">{PAUSE_DISCLAIMER}</p>
    </section>
  );
}

export function PauseReport({ scores }: { scores: PauseScores }) {
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const skipScroll = useRef(true);
  const current = PARTS[step] ?? PARTS[0];
  const last = PARTS.length - 1;

  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function renderPart(key: (typeof PARTS)[number]["key"]) {
    if (key === "score") return <ScoreCard scores={scores} />;
    if (key === "signal") return <SignalCard scores={scores} />;
    if (key === "process") return <ProcessCard />;
    return <NoteCard />;
  }

  return (
    <div ref={rootRef} className="scroll-mt-24">
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">
        {step + 1} / {PARTS.length} · {current.label}
      </p>
      <div className="mt-6">{renderPart(current.key)}</div>
      <nav className="mt-10 flex items-center justify-between gap-4" aria-label="분석지 파트">
        {step > 0 ? (
          <button type="button" className={PREV_BTN} onClick={() => setStep((s) => s - 1)}>
            이전
          </button>
        ) : (
          <span />
        )}
        {step < last ? (
          <button type="button" className={cn(NEXT_BTN, step === 0 && "ml-auto")} onClick={() => setStep((s) => s + 1)}>
            다음
          </button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
