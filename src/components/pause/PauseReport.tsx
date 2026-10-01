"use client";

import { useEffect, useRef, useState } from "react";

import type { LiftApplicant } from "@/components/check/LiftNextSheet";
import { PauseLiftClose } from "@/components/pause/PauseLiftClose";
import { cn } from "@/lib/utils";
import type { PauseScores } from "@/lib/pause/compute";
import { PAUSE_BAND_COPY, PAUSE_SIGNAL_COPY } from "@/lib/pause/copy";

export type { LiftApplicant };

const CARD = "border border-forest-20 bg-white px-5 py-6 sm:p-7 lg:p-10";

const PREV_BTN = "serif lined min-h-11 text-forest";
const NEXT_BTN =
  "serif inline-flex h-11 items-center justify-center rounded-sm bg-forest px-7 text-[15px] text-white shadow-[0_4px_4px_0_rgba(0,58,64,0.1)] hover:bg-forest-90 lg:h-12 lg:px-8 lg:text-base";

const PARTS = [
  { key: "score", label: "총점" },
  { key: "signal", label: "SIGNAL" },
  { key: "lift", label: "LIFT" },
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

function SignalCard() {
  return (
    <section className={CARD}>
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">{PAUSE_SIGNAL_COPY.eyebrow}</p>
      <p className="serif t3 mt-3 break-keep">{PAUSE_SIGNAL_COPY.title}</p>
      {PAUSE_SIGNAL_COPY.paragraphs.map((p) => (
        <p key={p} className="b3 mt-4 text-ink-70">
          {p}
        </p>
      ))}
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

export function PauseReport({
  scores,
  showCta = true,
  applicant,
}: {
  scores: PauseScores;
  showCta?: boolean;
  applicant?: LiftApplicant;
}) {
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
    if (key === "signal") return <SignalCard />;
    return <PauseLiftClose showCta={showCta} applicant={applicant} />;
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
