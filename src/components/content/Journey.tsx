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
