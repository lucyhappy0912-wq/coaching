import { LinedLink, PillButton } from "@/components/ui/Buttons";
import type { WeekCopy } from "@/lib/content";

export function ProcessChain({ steps }: { steps: readonly string[] }) {
  return (
    <p className="c1 tracking-[0.14em] text-forest-70 uppercase">
      {steps.join("  →  ")}
    </p>
  );
}

export function WeekJourney({ weeks }: { weeks: readonly WeekCopy[] }) {
  return (
    <ol className="space-y-12 lg:space-y-16">
      {weeks.map((item) => (
        <li key={item.week} className="border-t border-ink-15 pt-8">
          <p className="c1 tracking-[0.18em] text-stem uppercase">
            Week {item.week} · {item.stage}
          </p>
          <h3 className="t4 mt-3">{item.title}</h3>
          <div className="reading b2 mt-5 max-w-(--measure) text-ink-90">
            {item.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="b3 mt-6 text-forest">
            <span className="c1 mr-2 tracking-[0.16em] text-stem uppercase">Change</span>
            {item.change.from}
            <span className="mx-2 text-ink-30">→</span>
            {item.change.to}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function ConsultCta({
  title = "전환이 필요하다면",
  body = "첫 상담은 무료입니다. 지금 어떤 단계에 있는지 듣고, 맞는 프로그램을 함께 고릅니다.",
  showCheck = true,
}: {
  title?: string;
  body?: string;
  showCheck?: boolean;
}) {
  return (
    <section className="bg-forest px-(--gutter) py-16 text-white lg:py-20">
      <p className="c1 tracking-[0.2em] text-white/70 uppercase">Consult</p>
      <h2 className="t2 mt-3 max-w-(--measure-narrow)">{title}</h2>
      <p className="b2 mt-5 max-w-(--measure-narrow) text-white/85">{body}</p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <PillButton href="/consult" variant="white">
          무료 상담 신청
        </PillButton>
        {showCheck ? (
          <LinedLink href="/check" className="text-white">
            founder transition 진단
          </LinedLink>
        ) : null}
      </div>
    </section>
  );
}
