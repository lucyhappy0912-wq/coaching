import { LinedLink, PillButton } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import type { MediaRef } from "@/lib/cms/types";
import { FOUNDER_TRANSITION } from "@/lib/founder-transition";

function TransitionActions({ onForest = false }: { onForest?: boolean }) {
  const { checkLabel, consultLabel } = FOUNDER_TRANSITION.cta;
  return (
    <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-center">
      <PillButton href="/check" variant={onForest ? "white" : "solid"}>
        {checkLabel}
      </PillButton>
      <LinedLink href="/consult" className={onForest ? "text-white" : undefined}>
        {consultLabel}
      </LinedLink>
    </div>
  );
}

function TransitionHero({ hero }: { hero: MediaRef }) {
  const copy = FOUNDER_TRANSITION.hero;
  const motion = Boolean(hero.image && !hero.video);

  return (
    <header>
      <div className="relative min-h-[58vh] overflow-hidden lg:h-svh lg:min-h-[640px]">
        <Photo
          src={hero.image}
          video={hero.video}
          tone={hero.tone}
          alt={copy.title}
          priority
          className={motion ? "absolute inset-0 hero-kenburns" : "absolute inset-0"}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex min-h-[58vh] flex-col justify-end px-(--gutter) pb-12 text-white lg:h-full lg:min-h-[640px] lg:pb-24">
          <p className="c1 tracking-[0.22em] text-white/55 uppercase">{copy.eyebrow}</p>
          <h1 className="serif mt-4 text-[36px] leading-[1.05] lg:text-[64px]">{copy.title}</h1>
          <div className="b1 mt-6 max-w-(--measure-narrow) space-y-2 text-white/88">
            {copy.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#111] px-(--gutter) py-10 text-white lg:pb-16">
        <p className="c1 tracking-[0.14em] text-white/55 uppercase">{copy.axis}</p>
        <div className="b2 mt-5 max-w-(--measure-narrow) space-y-1 text-white/75">
          {copy.close.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <ol className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
          {copy.process.map((step, index) => (
            <li key={step} className="serif text-[22px] text-white lg:text-[28px]">
              <span className="mr-2 text-white/35">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}

function ProgramEssay() {
  const { title, kicker, body } = FOUNDER_TRANSITION.program;

  return (
    <section className="bg-white px-(--gutter) py-20 lg:py-28">
      <div className="reading b2 mx-auto max-w-(--measure) text-ink-90">
        <p className="c1 tracking-[0.2em] text-stem uppercase">{title}</p>
        <p className="serif mt-4 text-[22px] leading-snug text-forest lg:text-[28px]">{kicker}</p>
        {body.map((paragraph) =>
          paragraph.startsWith("“") ? (
            <p key={paragraph} className="quote mt-8">
              {paragraph}
            </p>
          ) : (
            <p key={paragraph}>{paragraph}</p>
          ),
        )}
      </div>
    </section>
  );
}

function SixWeekCards() {
  return (
    <section className="bg-grass-10 px-(--gutter) py-20 lg:py-28">
      <p className="c1 tracking-[0.2em] text-forest-70 uppercase">YOUR 6-WEEK JOURNEY</p>
      <ol className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {FOUNDER_TRANSITION.weeks.map((item) => (
          <li key={item.week} className="border border-ink-10 bg-white px-6 py-8 lg:p-10">
            <p className="serif text-[36px] leading-none text-forest/25 lg:text-[44px]">{item.week}</p>
            <p className="c1 mt-5 tracking-[0.2em] text-stem uppercase">
              WEEK {item.week} · {item.stage}
            </p>
            <h2 className="t4 mt-3 text-forest">{item.title}</h2>
            <div className="b3 mt-4 space-y-3 text-ink-90">
              {item.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="quote mt-6 text-[18px] lg:text-[20px]">
              <span className="c1 mr-2 tracking-[0.16em] text-stem uppercase">Change</span>
              {item.change.from}
              <span className="mx-2 text-ink-30">→</span>
              {item.change.to}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SixWeekTable() {
  return (
    <section className="bg-white px-(--gutter) py-20 lg:py-28">
      <div className="mx-auto max-w-(--measure-wide)">
        <table className="hidden w-full border-collapse text-left lg:table">
          <thead>
            <tr className="border-b border-forest-20">
              {["WEEK", "THEME", "핵심 질문", "주요 내용"].map((head) => (
                <th key={head} className="c1 py-4 pr-6 font-normal tracking-[0.16em] text-forest-70 uppercase">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FOUNDER_TRANSITION.table.map((row) => (
              <tr key={row.week} className="border-b border-ink-10 align-top">
                <td className="serif py-8 pr-6 text-[28px] leading-none text-forest/40">{row.week}</td>
                <td className="c1 py-8 pr-6 tracking-[0.2em] text-stem uppercase">{row.theme}</td>
                <td className="serif py-8 pr-6 text-[20px] leading-snug text-forest">{row.question}</td>
                <td className="b3 py-8 text-ink-90">{row.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ol className="lg:hidden">
          {FOUNDER_TRANSITION.table.map((row) => (
            <li key={row.week} className="border-t border-ink-10 py-8 last:border-b">
              <p className="c1 tracking-[0.18em] text-stem uppercase">
                WEEK {row.week} · {row.theme}
              </p>
              <p className="quote mt-4">{row.question}</p>
              <p className="b3 mt-4 text-ink-90">{row.summary}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function NextLeadershipBand() {
  const { eyebrow, line, body } = FOUNDER_TRANSITION.next;

  return (
    <section className="flex min-h-[40vh] flex-col justify-center bg-forest px-(--gutter) py-16 text-white lg:min-h-[50vh] lg:py-20">
      <p className="c1 tracking-[0.2em] text-white/55 uppercase">{eyebrow}</p>
      <h2 className="serif mt-4 max-w-(--measure) text-[32px] leading-[1.1] lg:text-[48px]">{line}</h2>
      <div className="b2 mt-8 max-w-(--measure-narrow) space-y-4 text-white/85">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <TransitionActions onForest />
    </section>
  );
}

function AfterPairs() {
  const { title, lead, points, close, pairs } = FOUNDER_TRANSITION.after;

  return (
    <section className="bg-white px-(--gutter) py-20 lg:py-28">
      <div className="mx-auto max-w-(--measure-wide)">
        <h2 className="serif text-[32px] text-forest lg:text-[48px]">{title}</h2>
        <p className="b2 mt-5 max-w-(--measure-narrow) text-ink-90">{lead}</p>
        <ul className="b2 mt-8 max-w-(--measure) space-y-2 text-ink-90">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="b2 mt-4 max-w-(--measure-narrow) text-ink-90">{close}</p>
        <ul className="mt-16">
          {pairs.map((pair) => (
            <li
              key={pair.before}
              className="grid gap-3 border-t border-ink-10 py-8 last:border-b lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10"
            >
              <p className="b2 text-ink-70">{pair.before}</p>
              <span aria-hidden className="text-ink-30">
                →
              </span>
              <p className="serif text-[18px] leading-snug text-forest lg:text-[22px]">{pair.after}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CloseEssay() {
  const { eyebrow, body } = FOUNDER_TRANSITION.close;

  return (
    <section className="bg-white px-(--gutter) pb-20 lg:pb-28">
      <div className="reading b2 mx-auto max-w-(--measure) text-ink-90">
        <p className="c1 tracking-[0.2em] text-stem uppercase">{eyebrow}</p>
        {body.map((paragraph) => (
          <p key={paragraph} className={paragraph === body[0] ? "mt-6" : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export function FounderTransition({ hero }: { hero: MediaRef }) {
  return (
    <article>
      <TransitionHero hero={hero} />
      <ProgramEssay />
      <SixWeekCards />
      <SixWeekTable />
      <NextLeadershipBand />
      <AfterPairs />
      <CloseEssay />
      <section className="bg-forest px-(--gutter) py-16 text-white lg:py-20">
        <p className="c1 tracking-[0.2em] text-white/55 uppercase">Founder Transition</p>
        <h2 className="t2 mt-3">{FOUNDER_TRANSITION.hero.title}</h2>
        <TransitionActions onForest />
      </section>
    </article>
  );
}
